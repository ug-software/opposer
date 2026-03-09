import { useEffect, useState } from "react";
import { JsonEditor, SplitPane, SplitPaneItem } from "../../components";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Navegation,
  WrapperControllersAndMethods,
  ContainerRequestAndResponse,
  HeaderRequestAndResponse,
  LeftPanel,
  BoxStatus,
  MethodTabs,
  MethodTab,
  ListItemButton,
} from "./styles";
import { playgroundApi } from "../../services";
import type { OpposerMap } from "../../interfaces";
import useRequest from "../../hooks/use-request";
import { useToast } from "../../context/toast";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

type ModelMethod = "get" | "insert" | "update" | "delete";

export function meta() {
  return [{ title: "Opposer - Playground" }];
}

export default () => {
  const [opposerMap, setOpposerMap] = useState<OpposerMap>({
    controllers: {},
    models: {},
  });
  const [isView, setIsView] = useState<"models" | "controllers">("models");
  const [modelMethod, setModelMethod] = useState<ModelMethod | undefined>(
    undefined
  );
  const [controller, setController] = useState<string>("");
  const [selected, setSelected] = useState<string>("");
  const [statusResult, setStatusResult] = useState<number>(0);
  const [paneResponse, setPaneResponse] = useState<string>("");
  const [paneRequest, setPaneRequest] = useState<string>("");
  const { showToast } = useToast();

  const [loadingGetOpposerMap, getOpposerMap] = useRequest(async () => {
    const result = await playgroundApi.getAppMap();

    if (result.success && result.data) {
      setOpposerMap(result.data);
    } else {
      showToast(result.error || "Erro ao carregar mapa da aplicação", "error");
    }

    return null;
  });

  const [loadingSendRequest, sendRequest] = useRequest(async () => {
    const result = await playgroundApi.sendRequestOpposer(paneRequest);

    if (result.status) {
      setStatusResult(result.status);
    }

    if (result.success && result.data) {
      setPaneResponse(JSON.stringify(result.data, null, 2));
    } else {
      showToast(result.error || "Erro na requisição", "error");
      setPaneResponse(JSON.stringify(result.data, null, 2));
    }
  });

  const handleChangePaneRequest = (value: string) => {
    return setPaneRequest(value);
  };

  const handleSelecteControllerMethod = (method: string, controller: string) => {
    setIsView("controllers");
    setSelected(method);
    setController(controller);
  };

  const handleSelecteModel = (model: string) => {
    setIsView("models");
    setSelected(model);
  };

  const handleSelectModelMethod = (method: ModelMethod) => {
    setModelMethod(method);
  };

  useEffect(() => {
    getOpposerMap();
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }

    switch (isView) {
      case "models":
        const modelData = opposerMap.models[selected] || { model: {} };
        const modelFields = modelData.model;
        const initialData = Object.keys(modelFields).reduce((acc: any, key) => {
          acc[key] =
            modelFields[key] === "number"
              ? 0
              : modelFields[key] === "boolean"
              ? false
              : "";
          return acc;
        }, {});

        if (modelMethod === "get") {
          setPaneRequest(
            JSON.stringify(
              {
                model: selected,
                method: modelMethod,
                query: {
                  filter: {},
                },
              },
              null,
              2
            )
          );
        }

        if (modelMethod === "insert") {
          setPaneRequest(
            JSON.stringify(
              {
                model: selected,
                method: modelMethod,
                data: initialData,
              },
              null,
              2
            )
          );
        }

        if (modelMethod === "update") {
          setPaneRequest(
            JSON.stringify(
              {
                model: selected,
                method: modelMethod,
                filter: {},
                data: initialData,
              },
              null,
              2
            )
          );
        }

        if (modelMethod === "delete") {
          setPaneRequest(
            JSON.stringify(
              {
                model: selected,
                method: modelMethod,
                filter: {},
              },
              null,
              2
            )
          );
        }

        break;

      default:
        const controllerMethods = opposerMap.controllers[controller] || {};
        const methodPayload = (controllerMethods as any)[selected]?.payload || {};
        const initialPayload = Object.keys(methodPayload).reduce(
          (acc: any, key) => {
            acc[key] =
              methodPayload[key] === "number"
                ? 0
                : methodPayload[key] === "boolean"
                ? false
                : "";
            return acc;
          },
          {}
        );

        setPaneRequest(
          JSON.stringify(
            {
              controller,
              method: selected,
              payload: initialPayload,
            },
            null,
            2
          )
        );

        break;
    }
  }, [modelMethod, selected, isView, opposerMap]);

  return (
    <WrapperControllersAndMethods>
      <Backdrop
        sx={(theme) => {
          return { zIndex: theme.zIndex.drawer + 1 };
        }}
        open={loadingGetOpposerMap}
      >
        <CircularProgress size={50} />
      </Backdrop>
      <Navegation>
        <List>
          <ListItem disablePadding disableGutters>
            <ListItemButton disabled>
              <ListItemIcon>
                <FiberManualRecordIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Models" />
            </ListItemButton>
          </ListItem>
          {Object.keys(opposerMap.models).map((model, index) => {
            return (
              <ListItem key={index} disablePadding disableGutters>
                <ListItemButton
                  selected={selected === model}
                  onClick={() => {
                    return handleSelecteModel(model);
                  }}
                >
                  <ListItemText
                    slotProps={{ primary: { noWrap: true } }}
                    inset
                    primary={model}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <List>
          {Object.keys(opposerMap.controllers).map((controller, index) => {
            return (
              <div key={index}>
                <ListItem disablePadding disableGutters>
                  <ListItemButton disabled>
                    <ListItemIcon>
                      <FiberManualRecordIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      slotProps={{ primary: { noWrap: true } }}
                      primary={controller}
                    />
                  </ListItemButton>
                </ListItem>
                {Object.keys(opposerMap.controllers[controller]).map(
                  (method, index) => {
                    return (
                      <ListItem key={index} disablePadding disableGutters>
                        <ListItemButton
                          selected={selected === method}
                          onClick={() => {
                            return handleSelecteControllerMethod(method, controller);
                          }}
                        >
                          <ListItemText
                            slotProps={{ primary: { noWrap: true } }}
                            inset
                            primary={method}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  }
                )}
              </div>
            );
          })}
        </List>
      </Navegation>
      <ContainerRequestAndResponse>
        <SplitPane>
          <SplitPaneItem>
            <LeftPanel sx={{ padding: "30px 10px 0 10px" }}>
              {isView === "models" && (
                <MethodTabs>
                  <MethodTab
                    variant={modelMethod === "get" ? "contained" : "text"}
                    color="inherit"
                    onClick={() => {
                      return handleSelectModelMethod("get");
                    }}
                  >
                    Obter
                  </MethodTab>
                  <MethodTab
                    variant={modelMethod === "insert" ? "contained" : "text"}
                    color="inherit"
                    onClick={() => {
                      return handleSelectModelMethod("insert");
                    }}
                  >
                    Inserir
                  </MethodTab>
                  <MethodTab
                    variant={modelMethod === "update" ? "contained" : "text"}
                    color="inherit"
                    onClick={() => {
                      return handleSelectModelMethod("update");
                    }}
                  >
                    Atualizar
                  </MethodTab>
                  <MethodTab
                    variant={modelMethod === "delete" ? "contained" : "text"}
                    color="inherit"
                    onClick={() => {
                      return handleSelectModelMethod("delete");
                    }}
                  >
                    Deletar
                  </MethodTab>
                </MethodTabs>
              )}
              <LeftPanel isBackgroundActive>
                <HeaderRequestAndResponse>
                  <Button
                    variant="contained"
                    disableElevation
                    startIcon={<SendRoundedIcon />}
                    onClick={sendRequest}
                  >
                    Send
                  </Button>
                </HeaderRequestAndResponse>
                <JsonEditor
                  value={paneRequest}
                  onChange={handleChangePaneRequest}
                />
              </LeftPanel>
            </LeftPanel>
          </SplitPaneItem>
          <SplitPaneItem>
            <LeftPanel sx={{ padding: "40px 10px 0 10px" }}>
              <HeaderRequestAndResponse>
                {statusResult > 0 && (
                  <BoxStatus status={statusResult}>
                    <Typography variant="body1" fontWeight="600">
                      {statusResult}
                    </Typography>
                  </BoxStatus>
                )}
              </HeaderRequestAndResponse>
              {loadingSendRequest ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="90%"
                >
                  <CircularProgress size={50} />
                </Box>
              ) : (
                <JsonEditor
                  showGutter={false}
                  readOnly={true}
                  value={paneResponse}
                />
              )}
            </LeftPanel>
          </SplitPaneItem>
        </SplitPane>
      </ContainerRequestAndResponse>
    </WrapperControllersAndMethods>
  );
};