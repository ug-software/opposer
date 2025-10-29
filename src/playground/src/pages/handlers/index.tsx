import { JsonEditor, SplitPane, SplitPaneItem } from "../../components";
import opposerMap from "../../../opposer-map.json"
import { Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Navegation, WrapperHandlersAndMethods, ContainerRequestAndResponse, HeaderRequestAndResponse, LeftPanel, BoxStatus } from "./styles";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export function meta() {
  return [
    { title: "Opposer - Handlers" }
  ];
}

export default () => {
    return(
        <WrapperHandlersAndMethods>
          <Navegation>
            <List>
              <ListItem disablePadding disableGutters>
                <ListItemButton disabled>
                  <ListItemIcon>
                    <FiberManualRecordIcon color="primary"/>
                  </ListItemIcon>
                  <ListItemText primary="Schemas" />
                </ListItemButton>
              </ListItem>
              {Object.keys(opposerMap.schemas).map(schema => (
                  <ListItem disablePadding disableGutters>
                      <ListItemButton>
                          <ListItemText inset primary={schema} />
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
                            <ListItemButton>
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
                  <LeftPanel isBackgroundActive>
                    <HeaderRequestAndResponse>
                      <Button variant="contained" disableElevation startIcon={<SendRoundedIcon/>}>Send</Button>
                    </HeaderRequestAndResponse>
                    <JsonEditor/>
                  </LeftPanel>
                </LeftPanel>
              </SplitPaneItem>
              <SplitPaneItem>
                <HeaderRequestAndResponse>
                  <BoxStatus variant="error">
                    200
                  </BoxStatus>
                </HeaderRequestAndResponse>
                <LeftPanel sx={{padding: "30px 15px 0 25px"}}>
                  <JsonEditor showGutter={false} readOnly={true}/>
                </LeftPanel>
              </SplitPaneItem>
            </SplitPane>
          </ContainerRequestAndResponse>
        </WrapperHandlersAndMethods>
    );
}