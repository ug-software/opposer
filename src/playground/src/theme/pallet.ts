import { createTheme, lighten } from "@mui/material";
import { grey } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00B686", // Verde principal (vivo, elegante)
      light: "#33CDA1", // Para hover, realces
      dark: "#00966E", // Para botões ativos, sombras
      contrastText: "#FFFFFF", // Texto sobre fundo verde
    },
    secondary: {
      main: "#00796B", // Verde mais fechado (complementar)
      light: "#26A69A",
      dark: "#004D40",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0D1117", // Fundo principal (quase preto, levemente azulado)
      paper: "#161B22", // Cartões, modais, painéis
    },
    text: {
      primary: "#E6F4F1", // Texto principal (esverdeado suave)
      secondary: "#9DB6AE", // Texto secundário (tons de musgo claro)
      disabled: "#5E6D67", // Texto desabilitado
    },
    error: {
      main: "#E57373",
    },
    warning: {
      main: "#FFB74D",
    },
    info: {
      main: "#4DD0E1",
    },
    success: {
      main: "#81C784",
    },
    divider: "rgba(0, 182, 134, 0.2)", // Linha divisória com leve toque verde
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    fontSize: 14,
    h1: { fontWeight: 600, letterSpacing: "-0.02em" },
    h2: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 500 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "30px",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",

          "&.Mui-disabled": {
            opacity: 1,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        inset: {
          paddingLeft: "20px",
          color: grey["500"],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: ({ palette }) => ({
        ".ace_editor": {
          height: "100% !important",
          overflow: "hidden",
        },
        ".ace-dracula": {
          backgroundColor: palette.background.default,
        },
        ".ace-dracula .ace_print-margin": {
          background: "none",
        },
      }),
    },
  },
});
