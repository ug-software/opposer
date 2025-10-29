import { Box, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

export const WrapperPaneSplitComponent = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  height: "100%",
  overflow: "hidden",

  "& > div": {
    width: "50%",
  },
}));

export const ButtonSplitPane = styled("div")(({ theme }) => ({
  zIndex: 999,
  width: "2px !important",
  cursor: "e-resize",
  //backgroundColor: theme.palette.primary.main,
  transition: "box-shadow 0.2s ease, border-color 0.2s ease",

  "&:active, &:hover": {
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.palette.primary.light,
  },
}));
