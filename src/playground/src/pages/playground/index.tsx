import opposerMap from "../../../opposer-map.json"
import { JsonEditor, SplitPane, SplitPaneItem } from "../../components";
import { Button, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import {
  Navegation,
  WrapperHandlersAndMethods,
  ContainerRequestAndResponse,
  HeaderRequestAndResponse,
  LeftPanel,
  BoxStatus,
  MethodTabs,
  MethodTab,
  ListItemButton
} from "./styles";

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from "react";

type ModelMethod = "get" | "insert" | "update" | "delete"

export function meta() {
  return [
    { title: "Opposer - Playground" }
  ];
}

export default () => {
    const [isView, setIsView] = useState<"models" | "handlers">("models");
    const [modelMethod, setModelMethod] = useState<ModelMethod>("get");
    const [selected, setSelected] = useState<string>("");

    const handleSelecteHandlerMethod = (method: string) => {
      setIsView("handlers");
      setSelected(method);
    }

    const handleSelecteModel = (model: string) => {
      setIsView("models");
      setSelected(model);
    }

    const handleSelectModelMethod = (method: ModelMethod) => {
      setModelMethod(method);
    }

    return(
        <WrapperHandlersAndMethods>
          <Navegation>
            <List>
              <ListItem disablePadding disableGutters>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <FiberManualRecordIcon color="primary"/>
                  </ListItemIcon>
                  <ListItemText primary="Models" />
                </ListItemButton>
              </ListItem>
              {Object.keys(opposerMap.models).map(model => (
                  <ListItem disablePadding disableGutters>
                      <ListItemButton selected={selected === model} onClick={() => handleSelecteModel(model)}>
                          <ListItemText inset primary={model} />
                      </ListItemButton>
                  </ListItem>
              ))}
            </List>
            <List>
              {Object.keys(opposerMap.handlers).map(handler => 
                (
                  <>
                    <ListItem disablePadding disableGutters>
                      <ListItemButton disabled>
                        <ListItemIcon>
                          <FiberManualRecordIcon color="primary"/>
                        </ListItemIcon>
                        <ListItemText primary={handler} />
                      </ListItemButton>
                    </ListItem>
                    {
                      Object.keys(opposerMap.handlers[handler]).map((method) => (
                        <ListItem disablePadding disableGutters>
                            <ListItemButton selected={selected === method} onClick={() => handleSelecteHandlerMethod(method)}>
                                <ListItemText inset primary={method} />
                            </ListItemButton>
                        </ListItem>
                      ))
                    }
                  </>
                )
              )}
            </List>
          </Navegation>
          <ContainerRequestAndResponse>
            <SplitPane>
              <SplitPaneItem>
                <LeftPanel sx={{padding: "30px 10px 0 10px"}}>
                  {isView === "models" && (
                    <MethodTabs>
                      <MethodTab 
                        variant={modelMethod === "get" ? "contained" : "text"} 
                        color="inherit" 
                        onClick={() => handleSelectModelMethod("get")}
                      >
                        Obter
                      </MethodTab>
                      <MethodTab
                        variant={modelMethod === "insert" ? "contained" : "text"} 
                        color="inherit"
                        onClick={() => handleSelectModelMethod("insert")}
                      >
                        Inserir
                      </MethodTab>
                      <MethodTab
                        variant={modelMethod === "update" ? "contained" : "text"} 
                        color="inherit"
                        onClick={() => handleSelectModelMethod("update")}
                      >
                        Atualizar
                      </MethodTab>
                      <MethodTab
                        variant={modelMethod === "delete" ? "contained" : "text"} 
                        color="inherit"
                        onClick={() => handleSelectModelMethod("delete")}
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
                        startIcon={<SendRoundedIcon/>}
                      >
                        Send
                      </Button>
                    </HeaderRequestAndResponse>
                    <JsonEditor/>
                  </LeftPanel>
                </LeftPanel>
              </SplitPaneItem>
              <SplitPaneItem>
                <LeftPanel sx={{padding: "40px 10px 0 10px"}}>
                  <HeaderRequestAndResponse>
                    <BoxStatus variant="success">
                      <Typography variant="body1" fontWeight="600">
                        200
                      </Typography>
                    </BoxStatus>
                  </HeaderRequestAndResponse>
                  <JsonEditor showGutter={false} readOnly={true}/>
                </LeftPanel>
              </SplitPaneItem>
            </SplitPane>
          </ContainerRequestAndResponse>
        </WrapperHandlersAndMethods>
    );
}