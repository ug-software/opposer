import { styled, Drawer as MuiDrawer } from '@mui/material';

export const Drawer = styled(MuiDrawer)(({ open }) => ({
  '.MuiDrawer-paper': {
    padding: '0',
    ...(open && {
      width: '200px',
    }),
  },
  '.MuiListItemText-root': {
    display: open ? 'block' : 'none',
    margin: 0,
  },
  '.MuiListItemIcon-root': {
    minWidth: open ? '35px' : '0px',
    display: 'flex',
    justifyContent: 'center',
  },
  '.MuiListItemButton-root': {
    justifyContent: open ? 'flex-start' : 'center',
    padding: open ? '12px 16px' : '12px 16px',
    width: '100%',
  },
}));
