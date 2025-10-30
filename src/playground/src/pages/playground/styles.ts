import {
  Box,
  lighten,
  styled,
  ListItemButton as MuiListItemButton,
  Button,
} from "@mui/material";
import { green, orange, red } from "@mui/material/colors";

export const WrapperHandlersAndMethods = styled(Box)({
  display: "flex",
  height: "100%",
});

export const Navegation = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "13rem",
  minWidth: "13rem",
  padding: "2rem 10px 0 0",
}));

export const ContainerRequestAndResponse = styled(Box)({
  height: "100vh",
  width: "100%",
  overflow: "hidden",
});

export const HeaderRequestAndResponse = styled(Box)(({ theme }) => ({
  height: "3rem",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  padding: "0 5px",
}));

export const LeftPanel = styled(Box)<{ isBackgroundActive?: boolean }>(
  ({ theme, isBackgroundActive }) => ({
    padding: "10px",
    height: "100%",
    width: "100%",
    ...(isBackgroundActive && {
      borderRadius: "20px 20px 0 0",
      backgroundColor: theme.palette.background.paper,

      ".ace-dracula": {
        backgroundColor: theme.palette.background.paper,
      },

      ".ace-dracula .ace_gutter": {
        backgroundColor: theme.palette.background.paper,
      },
    }),
  })
);

export const BoxStatus = styled(Box)<{
  variant: "success" | "error" | "warning";
}>(({ variant, theme }) => ({
  marginRight: "1rem",
  padding: "4px 15px",
  borderRadius: "3px",

  ...(variant === "success" && {
    backgroundColor: green["500"],
  }),

  ...(variant === "warning" && {
    backgroundColor: orange["500"],
  }),

  ...(variant === "error" && {
    backgroundColor: red["500"],
  }),
}));

export const MethodTabs = styled(Box)({
  padding: "5px 10px 10px 10px",
});

export const MethodTab = styled(Button)({
  marginLeft: "0.5rem",
  width: "4.5rem",
});

export const ListItemButton = styled(MuiListItemButton)(
  ({ selected, theme }) => ({
    ...(selected && {
      backgroundColor: `${lighten(theme.palette.background.default, 0.1)} !important`,

      ".MuiListItemText-root": {
        color: "white",
      },
    }),
  })
);
