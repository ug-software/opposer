import { styled, Drawer as MuiDrawer } from "@mui/material";

export const Drawer = styled(MuiDrawer)(({ open }) => ({
  ".MuiDrawer-paper": {
    padding: "0 5px",
    ...(open && {
      width: "200px",
    }),
  },
  ".MuiListItemText-root": {
    display: open ? "block" : "none",
  },
  ".MuiListItemIcon-root": {
    minWidth: open ? "35px" : "0px",
  },
  ".MuiListItemButton-root": {
    borderRadius: "8px",
  },
  ...(!open && {
    ".MuiButtonBase-root": {
      padding: "12px 16px",
    },
  }),
}));
