import { Box, styled } from "@mui/material";

export const MainWrapperLayout = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

export const MainContainerLayout = styled(Box)<{ open: boolean | undefined }>(
  ({ open }) => ({
    padding: !open ? "0 0 0 80px" : "0 0 0 210px",
    height: "100vh",
  })
);

export const MainNavLayout = styled(Box)({});
