import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Button,
  
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftButton from "components/SoftButton";

function ReusableModal({ open, onClose, modalTitle, modalBody, onSaveChanges , cancelButtonText, saveButtonText}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 600,
          bgcolor: "#ffffff",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "90vh",
          borderRadius: 5,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" align="center" gutterBottom id="modal-title">
          {modalTitle}
        </Typography>

        <Box id="modal-description">
          {modalBody}
        </Box>

    
         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton  color="dark" variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
            {cancelButtonText}
            </SoftButton>
            <SoftButton variant="gradient" color="info"  onClick={onSaveChanges}>
             {saveButtonText}
            </SoftButton>
          </Box>
      </Box>
    </Modal>
  );
}

ReusableModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalTitle: PropTypes.string.isRequired,
  modalBody: PropTypes.node.isRequired,
  onSaveChanges: PropTypes.func.isRequired,
  cancelButtonText:PropTypes.string.isRequired,
  saveButtonText:PropTypes.string.isRequired,
};

export default ReusableModal;