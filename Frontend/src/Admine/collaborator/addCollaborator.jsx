import React, { useEffect, useState } from "react";
import Icon from "@mui/material/Icon";
import SoftButton from "components/SoftButton";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftInput from "components/SoftInput";
import useCollaboratorStore from "store/collaboratorStore";
import PropTypes from "prop-types";

function AddCollaborator({ visible, setVisible, selectedCollaborator, setSelectedCollaborator }) {
  const [formData, setFormData] = useState({
    id: Date.now(),
    name: "",
    email: "",
    phone: "",
    job: "",
    department: "",
    organization: "",
    employementDate: "",
    password: "",
    confirmPassword: "",
  });

  const addCollaborator = useCollaboratorStore((state) => state.addCollaborator);
  const updateCollaborator = useCollaboratorStore((state) => state.updateCollaborator);

  useEffect(() => {
    if (selectedCollaborator) {
      setFormData(selectedCollaborator);
    } else {
      setFormData({
        id: Date.now(),
        name: "",
        email: "",
        phone: "",
        job: "",
        department: "",
        organization: "",
        employementDate: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [selectedCollaborator]);

  const handleJobChange = (event) => {
    setFormData({ ...formData, job: event.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (selectedCollaborator) {
      updateCollaborator(formData);
    } else {
      addCollaborator(formData);
    }

    setVisible(false);
    setSelectedCollaborator(null);
  };

  return (
    <>
      <SoftButton variant="gradient" color="dark" onClick={() => setVisible(true)}>
        <Icon sx={{ fontWeight: "bold" }}>add</Icon>
        &nbsp;{selectedCollaborator ? "Edit Collaborator" : "Add New Collaborator"}
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
            {selectedCollaborator ? "Edit Collaborator" : "Add Collaborator"}
          </Typography>

          <Box
            id="modal-description"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <SoftInput
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              icon={{
                component: "person",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              icon={{
                component: "email",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              icon={{
                component: "phone",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              icon={{
                component: "lock",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              icon={{
                component: "lock",
                direction: "left",
              }}
            />
          </Box>

          <Box
            id="job-info"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2, mt: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              Job Information
            </Typography>
            <FormControl fullWidth variant="outlined">
              <Select
                labelId="role-label"
                id="role-select"
                value={formData.job}
                onChange={handleJobChange}
                startAdornment={
                  <InputAdornment style={{ fontSize: 16, color: "#344767" }} position="start">
                    <Icon>work</Icon>
                  </InputAdornment>
                }
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Choose a role</em>;
                  }
                  return selected;
                }}
                label="Role"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="collaborator">Collaborator</MenuItem>
              </Select>
            </FormControl>
            <SoftInput
              placeholder="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              icon={{
                component: "apartment",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              icon={{
                component: "business",
                direction: "left",
              }}
            />
            <SoftInput
              placeholder="Employment Date"
              name="employementDate"
              value={formData.employementDate}
              onChange={handleInputChange}
              icon={{
                component: "calendar_today",
                direction: "left",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton
              color="dark"
              variant="outlined"
              onClick={() => {
                setVisible(false);
                setSelectedCollaborator(null);
              }}
              sx={{ mr: 2 }}
            >
              Close
            </SoftButton>
            <SoftButton color="white" onClick={handleSubmit}>
              Save changes
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

// Define PropTypes
AddCollaborator.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  selectedCollaborator: PropTypes.object,
  setSelectedCollaborator: PropTypes.func.isRequired,
};

export default AddCollaborator;
