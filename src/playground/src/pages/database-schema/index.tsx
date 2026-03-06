import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import {
  WrapperSchema,
  Navigation,
  ContentArea,
  SchemaCard,
  StyledTableContainer,
  ListItemButton,
} from "./styles";
import { playgroundApi } from "../../services";
import type { OpposerMap } from "../../interfaces";
import useRequest from "../../hooks/use-request";
import { useToast } from "../../context/toast";

export function meta() {
  return [{ title: "Opposer - Database Schemas" }];
}

export default function DatabaseSchema() {
  const [opposerMap, setOpposerMap] = useState<OpposerMap>({
    handlers: {},
    models: {},
  });
  const [selectedModel, setSelectedModel] = useState<string>("");
  const { showToast } = useToast();

  const [loadingGetOpposerMap, getOpposerMap] = useRequest(async () => {
    const result = await playgroundApi.getAppMap();
    if (result.success && result.data) {
      setOpposerMap(result.data);
      const firstModel = Object.keys(result.data.models)[0];
      if (firstModel) {
        setSelectedModel(firstModel);
      }
    } else {
      showToast(result.error || "Erro ao carregar mapa da aplicação", "error");
    }
    return null;
  });

  useEffect(() => {
    getOpposerMap();
  }, []);

  const modelData = selectedModel ? opposerMap.models[selectedModel] : null;
  const fields = modelData?.schema || {};
  const description = modelData?.description || "Database Entity Definition";

  return (
    <WrapperSchema>
      <Backdrop
        sx={(theme) => {
          return { zIndex: theme.zIndex.drawer + 1 };
        }}
        open={loadingGetOpposerMap}
      >
        <CircularProgress size={50} />
      </Backdrop>

      <Navigation>
        <Typography variant="h6" sx={{ px: 2, mb: 2, fontWeight: "bold" }}>
          Entities
        </Typography>
        <List>
          {Object.keys(opposerMap.models).map((model, index) => {
            return (
              <ListItem key={index} disablePadding disableGutters>
                <ListItemButton
                  selected={selectedModel === model}
                  onClick={() => {
                    return setSelectedModel(model);
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
      </Navigation>

      <ContentArea>
        {selectedModel ? (
          <SchemaCard elevation={0}>
            <Box mb={3}>
              <Typography variant="h4" color="primary" gutterBottom>
                {selectedModel}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {description}
              </Typography>
            </Box>

            <Divider />

            <StyledTableContainer component={Paper} elevation={0}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "background.paper" }}>
                      Field Name
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ backgroundColor: "background.paper" }}
                    >
                      Data Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(fields).map(([fieldName, type]) => {
                    return (
                      <TableRow
                        key={fieldName}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: 500 }}
                        >
                          {fieldName}
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: "4px",
                              backgroundColor: "action.hover",
                              fontFormat: "monospace",
                              fontSize: "0.85rem",
                            }}
                          >
                            {type as string}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </SchemaCard>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Typography variant="h6" color="textSecondary">
              Select an entity to view its schema
            </Typography>
          </Box>
        )}
      </ContentArea>
    </WrapperSchema>
  );
}
