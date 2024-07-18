/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import Icon from "@mui/material/Icon";
import SoftButton from "components/SoftButton";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout"
import { Modal,Box,IconButton,Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
function AddCollaborator() {
  const [visible, setVisible] = useState(false);

  return (
    <DashboardLayout>
      <SoftButton variant="gradient" color="dark" onClick={() => setVisible(true)}>
        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
        &nbsp;Add New Collaborator
      </SoftButton>
      <Modal
        open={visible}
        onClose={()=> setVisible(false)}
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
            borderRadius: 8,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() =>  setVisible(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" gutterBottom id="modal-title">
            Add Collaborator
          </Typography>

          <Box id="modal-description">
            Forms
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton color="secondary" onClick={() =>  setVisible(false)} sx={{ mr: 2 }}>
              Close
            </SoftButton>
            <SoftButton color="primary">
              Save changes
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default AddCollaborator;
