import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { BrowserRouter } from "react-router-dom";
import Pages from "./pages";

/*function App() {
 
  return (
    <div className="wrapper-opposer-playground">
      <nav className="wrapper-opposer-nav">
        <Toolbar/>
        <MenuItem 
          title="Schemas" 
          icon={<Schema />}
        >
          <MenuItemOption>User</MenuItemOption>
          <MenuItemOption>Book</MenuItemOption>
        </MenuItem>
        <MenuItem 
          title="Ações" 
          icon={<Action />}
        >
          <MenuItemOption>get-all-user-per-country</MenuItemOption>
        </MenuItem>
      </nav>
      <aside className="content-opposer-playground">
        <div className="wrapper-opposer-tabs">
          <Tab
            label="Buscar"
            selected
          />
          <Tab
            label="Inserir"
          />
          <Tab
            label="Atualizar"
          />
          <Tab
            label="Deletar"
          />
          <Tab
            label="Model"
          />
        </div>
        <div className="content-opposer-data-and-request">
          <SplitPane>
            <SplitPaneItem>
              <div className="wrapper-action-send-content">
                <Button disableRipple endIcon={<PlayArrowRoundedIcon/>} variant="contained" disableElevation>Send</Button>
              </div>
              <JsonEditor/>
            </SplitPaneItem>
            <SplitPaneItem>
              <div className="wrapper-action-send-content">
                <div className="status-code-return-request s-500">500</div>
              </div>
              <JsonEditor/>
            </SplitPaneItem>
          </SplitPane>
        </div>
      </aside>
    </div>
  )
}*/

export default () => {
  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Pages/>
      </BrowserRouter>
    </ThemeProvider>
  );
}