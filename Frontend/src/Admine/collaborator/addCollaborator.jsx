import React, { useEffect, useState } from "react";
import StyledIcon from "components/StyledIcon";
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
  TextField,
  Icon,
  FormHelperText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCollaboratorStore from "store/collaboratorStore";
import useValidationStore from "store/useValidationStore ";
import PropTypes from "prop-types";
import ConfirmationModal from "components/ConfirmatonModal";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';  // Import dayjs to handle date formats

const initialState = {
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
};

function AddCollaborator({ visible, setVisible, selectedCollaborator, setSelectedCollaborator }) {
  const [formData, setFormData] = useState(initialState);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState('');

  const { errors, validate, clearErrors } = useValidationStore((state) => ({
    errors: state.errors,
    validate: state.validate,
    clearErrors: state.clearErrors,
  }));

  const addCollaborator = useCollaboratorStore((state) => state.addCollaborator);
  const updateCollaborator = useCollaboratorStore((state) => state.updateCollaborator);

  useEffect(() => {
    if (selectedCollaborator) {
      setFormData(selectedCollaborator);
    } else {
      setFormData(initialState);
    }
  }, [selectedCollaborator]);

  const handleJobChange = (event) => {
    setFormData({ ...formData, job: event.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, employementDate: date ? date.format('YYYY-MM-DD') : '' });
  };

  const handleConfirm = () => {
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      if (selectedCollaborator) {
        updateCollaborator(formData);
      } else {
        addCollaborator(formData);
      }
      setSelectedCollaborator(null);
      setConfirmOpen(false);
    }
  };

  const handleSubmit = () => {
    clearErrors();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length === 0) {
      setActionType(selectedCollaborator ? 'update' : 'add');
      setConfirmOpen(true);
      setVisible(false);
    }
  };

  const handleModalClose = () => {
    clearErrors(); 
    setVisible(false);
    setSelectedCollaborator(null);
  };

  const modalTitle = actionType === 'update' ? 'Update Collaborator' : 'Add Collaborator';
  const modalBody = actionType === 'update'
    ? 'Are you sure you want to update this collaborator?'
    : 'Are you sure you want to add this new collaborator?';

  return (
    <>
      <SoftButton variant="gradient" color="dark" onClick={() => setVisible(true)}>
        <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
        &nbsp;{selectedCollaborator ? "Edit Collaborator" : "Add New Collaborator"}
      </SoftButton>
      <Modal
        open={visible}
        onClose={handleModalClose}
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
            <IconButton onClick={handleModalClose}>
              <CloseIcon sx={{ fontSize: 16, color: '#141727' }} />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" gutterBottom id="modal-title">
            {selectedCollaborator ? "Edit Collaborator" : "Add Collaborator"}
          </Typography>

          <Box
            id="modal-description"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>person</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>email</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>phone</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>lock</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>lock</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box
            id="job-info"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2, mt: 2 }}
          >
            <FormControl fullWidth variant="outlined">
              <Select
                value={formData.job}
                onChange={handleJobChange}
                displayEmpty
                placeholder="Select a title"
                startAdornment={
                  <InputAdornment style={{ fontSize: 16, color: "#344767" }} position="start">
                    <Icon>work</Icon>
                  </InputAdornment>
                }
              >
                <MenuItem value="" disabled>Select a title</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Collaborator">Collaborator</MenuItem>
              </Select>
              {errors.job && <FormHelperText error>{errors.job}</FormHelperText>}
            </FormControl>
            <TextField
              placeholder="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              error={!!errors.department}
              helperText={errors.department}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>apartment</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="Organization"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              error={!!errors.organization}
              helperText={errors.organization}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>business</StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                placeholder="Employment Date"
                value={formData.employementDate ? dayjs(formData.employementDate) : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                error={!!errors.employementDate}
                helperText={errors.employementDate}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <SoftButton
              color="dark"
              variant="outlined"
              onClick={handleModalClose}
              sx={{ mr: 2 }}
            >
              Close
            </SoftButton>
            <SoftButton variant="gradient" color="success" onClick={handleSubmit}>
              Save changes
            </SoftButton>
          </Box>
        </Box>
      </Modal>
      <ConfirmationModal
        open={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
        title={modalTitle}
        description={modalBody}
        actionType={actionType}
        onConfirm={handleConfirm}
      />
    </>
  );
}

AddCollaborator.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  selectedCollaborator: PropTypes.object,
  setSelectedCollaborator: PropTypes.func.isRequired,
};

export default AddCollaborator;
