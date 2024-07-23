import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import SoftButton from './SoftButton';

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "600px",
  bgcolor: "#fff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  p: 3,
  borderRadius: "12px",
  overflowY: "auto",
  maxHeight: "80vh",
  zIndex: 1300,
  transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
};

const backdropStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 1200,
};  

const ConfirmationModal = ({ open, handleClose, title, description, onConfirm, actionType }) => {
  const isDeleteAction = actionType === 'delete';
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{ 
        "& .MuiBackdrop-root": backdropStyle,
        "& .MuiModal-root": { display: 'flex', alignItems: 'center', justifyContent: 'center' }
      }}
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {description}
        </Typography>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <SoftButton 
            variant="gradient" 
            color={isDeleteAction ? 'error' : 'success'} 
            onClick={onConfirm} 
            sx={{ mr: 1 }}
          >
            Confirm
          </SoftButton>
          <SoftButton variant="outlined" color="dark" onClick={handleClose}>
            Cancel
          </SoftButton>
        </Box>
      </Box>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  actionType: PropTypes.string.isRequired,
};

export default ConfirmationModal;
