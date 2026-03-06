import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button, 
  Divider 
} from '@mui/material';

interface ConfirmContextType {
  confirmAction: (options: ConfirmOptions) => void;
}

interface ConfirmOptions {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirmAction = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const handleConfirm = () => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    setOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirmAction }}>
      {children}
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="confirm-dialog-title">
          {options?.title || 'Confirmar Ação'}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {options?.description}
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancel} color="primary" disableElevation>
            {options?.cancelText || 'Cancelar'}
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" disableElevation autoFocus>
            {options?.confirmText || 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (context === undefined) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};
