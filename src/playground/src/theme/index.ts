import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10B981", // Verde esmeralda (principal)
      light: "#34D399",
      dark: "#059669",
      contrastText: "#0D0D0D",
    },
    secondary: {
      main: "#22C55E", // Verde mais vibrante
      light: "#4ADE80",
      dark: "#15803D",
      contrastText: "#0D0D0D",
    },
    background: {
      default: "#0B0F0E", // fundo base (quase preto, com leve tom esverdeado)
      paper: "#111C17", // cards e blocos de conteúdo
    },
    text: {
      primary: "#E6F4E6",
      secondary: "#A0BCA5",
      disabled: "#6B7D72",
    },
    divider: "rgba(32, 58, 46, 0.6)",
    success: {
      main: "#22C55E",
    },
    error: {
      main: "#EF4444",
    },
    warning: {
      main: "#F59E0B",
    },
    info: {
      main: "#2DD4BF",
    },
  },

  typography: {
    fontFamily: `'JetBrains Mono', 'Fira Code', monospace`,
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: "2.2rem" },
    h2: { fontWeight: 600, fontSize: "1.8rem" },
    h3: { fontWeight: 600, fontSize: "1.4rem" },
    body1: { color: "#E6F4E6" },
    body2: { color: "#A0BCA5" },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#111C17",
          border: "1px solid rgba(16,185,129,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          "&:hover": {
            backgroundColor: "#059669",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #0F1714 0%, #11221B 100%)",
          borderBottom: "1px solid rgba(16,185,129,0.2)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(16,185,129,0.2)",
        },
      },
    },
  },
});
