import React, { useState } from 'react';
import Icon from "@mui/material/Icon";
import SoftButton from "components/SoftButton";
import { Modal, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SoftInput from "components/SoftInput";

function AddCollaborator() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <SoftButton variant="gradient" color="dark" onClick={() => setVisible(true)}>
        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
        &nbsp;Add New Collaborator
      </SoftButton>
      <Modal
        open={visible}
        onClose={() => setVisible(false)}
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
            <IconButton onClick={() => setVisible(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" gutterBottom id="modal-title">
            Add Collaborator
          </Typography>

          <Box id="modal-description" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SoftInput
              placeholder="Name"
              icon={{
                component: "person",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Email"
              icon={{
                component: "email",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Phone Number"
              icon={{
                component: "phone",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Job"
              icon={{
                component: "work",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Department"
              icon={{
                component: "apartment",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Organization"
              icon={{
                component: "business",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Employment Date"
              icon={{
                component: "calendar_today",
                direction: "left",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton color="secondary" onClick={() => setVisible(false)} sx={{ mr: 2 }}>
              Close
            </SoftButton>
            <SoftButton color="primary">
              Save changes
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default AddCollaborator;
