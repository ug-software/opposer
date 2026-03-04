import {
  Box,
  lighten,
  styled,
  ListItemButton as MuiListItemButton,
  Paper,
  TableContainer,
} from "@mui/material";

export const WrapperSchema = styled(Box)({
  display: "flex",
  height: "100%",
});

export const Navigation = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "13rem",
  minWidth: "13rem",
  padding: "2rem 10px 0 0",
}));

export const ContentArea = styled(Box)({
  height: "100vh",
  width: "100%",
  padding: "2rem",
  overflowY: "auto",
});

export const SchemaCard = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "15px",
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  maxWidth: "800px",
  margin: "0 auto",
}));

export const StyledTableContainer = styled(TableContainer)({
  marginTop: "1.5rem",
  borderRadius: "8px",
  "& .MuiTableCell-head": {
    fontWeight: "bold",
    backgroundColor: lighten("#000", 0.05),
  },
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
