import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from "@mui/material";
import type { DialogProps } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ModalProps extends Omit<DialogProps, "onClose"> {
  title?: string;
  onClose: () => void;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  actions,
  showCloseButton = true,
  children,
  ...props
}) => {
  return (
    <Dialog onClose={onClose} maxWidth="sm" fullWidth {...props}>
      {title && (
        <DialogTitle>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
