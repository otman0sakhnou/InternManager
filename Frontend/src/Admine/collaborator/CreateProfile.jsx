import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  MenuItem,
  Select,
  FormHelperText,
  FormControl,
  Grid,
  IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LockIcon from "@mui/icons-material/Lock";
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import StyledIcon from "components/StyledIcon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useValidationStore from "store/useValidationStore";
import dayjs from "dayjs";
import useCollaboratorStore from "store/collaboratorStore";
import { validate, validationSchemas } from "utils/validation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "components/ConfirmationModals";
import Backdrop from "@mui/material/Backdrop";
import { DNA } from "react-loader-spinner";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #2152ff 0%, #21d4fd 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "linear-gradient(95deg, #2152ff 0%, #21d4fd 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #2152ff 0%, #21d4fd 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #2152ff 0%, #21d4fd 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <LockIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

const steps = ["Personal Information", "Organization Details", "Account Setup"];

export default function CreateProfile() {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const [activeStep, setActiveStep] = React.useState(0);
  const addCollaborator = useCollaboratorStore((state) => state.addCollaborator);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    title: "",
    department: "",
    organization: "",
    employmentDate: null,
    password: "",
    confirmPassword: "",
  });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);
  const { getCollaborators } = useCollaboratorStore((state) => ({
    getCollaborators: state.getCollaborators
  }));
  const { errors, setErrors } = useValidationStore();

  const navigate = useNavigate();

  // Validation function
  const getActiveStepSchema = (step) => {
    if (step === 0) {
      return {
        name: validationSchemas.name,
        email: validationSchemas.email,
        phone: validationSchemas.phone,
        gender: validationSchemas.gender,
      };
    } else if (step === 1) {
      return {
        organization: validationSchemas.organization,
        department: validationSchemas.department,
        title: validationSchemas.title,
        employmentDate: validationSchemas.employmentDate,
      };
    } else if (step === 2) {
      return {
        password: validationSchemas.password,
        confirmPassword: validationSchemas.confirmPassword,
      };
    }
  };
  const submit = async () => {
    setLoading(true);
    try {
      await addCollaborator(formData);
      await getCollaborators();
      toast.success('Collaborator saved successfully');
      navigate("/collaborator");
    } catch (error) {
      toast.error("Failed to delete collaborator");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    const schema = getActiveStepSchema(activeStep);
    const newErrors = validate(formData, schema);

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      if (activeStep === steps.length - 1) {
        setConfirmationModalTitle("Add Collaborator");
        setConfirmationModalDescription("Are you sure you want to add this collab ?");
        setOnConfirmAction(() => () => {
          submit();
        })
        setIsConfirmationModalOpen(true);

      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, employmentDate: date ? dayjs(date).format("YYYY-MM-DD") : null });
  };
  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
  };
  const roles = ["Admin", "Manager", "Collaborator"]
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 4, m: 2, borderRadius: 4, boxShadow: 3 }}>
        <Stack sx={{ my: 5, width: "100%" }} spacing={4}>
          <SoftTypography
            textAlign="center"
            variant="h3"
            fontWeight="bold"
            color="dark"
            textGradient
          >
            Set up a Profile for the Collaborator
          </SoftTypography>
          <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon} StepIconProps={{ icon: index + 1 }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 2 }}>
              {activeStep === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={formData.gender}
                        onChange={handleGenderChange}
                        displayEmpty
                        variant="outlined"
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <span style={{ color: "#CCCCCC" }}>
                                Select collaborator&apos;s gender
                              </span>
                            );
                          }
                          return selected;
                        }}
                        startAdornment={
                          <InputAdornment
                            style={{ fontSize: 16, color: "#344767" }}
                            position="start"
                          >
                            <StyledIcon>wc_icone</StyledIcon>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="" disabled>
                          Select collaborator&apos;s gender
                        </MenuItem>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                      {!!errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid container justifyContent="end" alignItems="end" margin={2}>
                    <SoftButton variant="gradient" color="info" onClick={handleNext}>
                      Next
                    </SoftButton>
                  </Grid>
                </Grid>
              )}
              {activeStep === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
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
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        displayEmpty
                        variant="outlined"
                        error={!!errors.department}
                        helperText={errors.department}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return (
                              <span style={{ color: "#CCCCCC" }}>Select department</span>
                            );
                          }
                          return selected;
                        }}
                        startAdornment={
                          <InputAdornment
                            style={{ fontSize: 16, color: "#344767" }}
                            position="start"
                          >
                            <StyledIcon>apartment</StyledIcon>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="" disabled>
                          Select department
                        </MenuItem>
                        <MenuItem value="Microsoft&Data">Microsoft & Data</MenuItem>
                        <MenuItem value="Front&Mobile">Front & Mobile</MenuItem>
                        <MenuItem value="Java">Java</MenuItem>
                        <MenuItem value="PHP">PHP</MenuItem>
                        <MenuItem value="Devops">Devops</MenuItem>
                        <MenuItem value="Test&Support">Test & Support</MenuItem>
                      </Select>
                      {!!errors.department && (
                        <FormHelperText error>{errors.department}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      placeholder="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      error={!!errors.title}
                      helperText={errors.title}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledIcon>work</StyledIcon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!errors.employmentDate}>
                      <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                        <DatePicker
                          placeholder="Employment Date"
                          value={formData.employmentDate ? dayjs(formData.employmentDate) : null}
                          onChange={handleDateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.employmentDate}
                              helperText={errors.employmentDate}
                            />
                          )}
                        />
                        {errors.employmentDate && (
                          <FormHelperText p={2} error>
                            {errors.employmentDate}
                          </FormHelperText>
                        )}
                      </LocalizationProvider>
                    </FormControl>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    margin={2}
                  >
                    <SoftButton variant="gradient" color="dark" onClick={handleBack}>
                      Previous
                    </SoftButton>
                    <SoftButton variant="gradient" color="info" onClick={handleNext}>
                      Next
                    </SoftButton>
                  </Grid>
                </Grid>
              )}
              {activeStep === 2 && (
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item lg={12} md={12} xs={12} >
                      <FormControl fullWidth error={!!errors.role}>
                        <Select
                          value={formData.role}
                          onChange={handleInputChange}
                          displayEmpty
                          variant="outlined"
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#CCCCCC" }}>Select role</span>;
                            }
                            return selected;
                          }}
                          startAdornment={
                            <InputAdornment
                              style={{ fontSize: 16, color: "#344767" }}
                              position="start"
                            >
                              <StyledIcon>person</StyledIcon>
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="" disabled>
                            Select role
                          </MenuItem>
                          {roles.map((role, index) => (
                            <MenuItem key={index} value={role}>
                              {role}
                            </MenuItem>
                          ))}
                        </Select>
                        {!!errors.role && (
                          <FormHelperText>{errors.role}</FormHelperText>
                        )}
                      </FormControl>

                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        fullWidth
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledIcon>lock</StyledIcon>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={togglePasswordVisibility} sx={{ color: "#344767" }}>
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <TextField
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        fullWidth
                        variant="outlined"
                        type={showConfirmPassword ? "text" : "password"}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledIcon>lock</StyledIcon>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end" onClick={toggleConfirmPasswordVisibility}>
                              <IconButton sx={{ color: "#344767" }}>
                                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    margin={2}
                    xs={12}
                  >
                    <SoftButton variant="gradient" color="dark" onClick={handleBack}>
                      Previous
                    </SoftButton>
                    <SoftButton variant="gradient" color="info" onClick={handleNext}>
                      Finish
                    </SoftButton>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Stack>
      </Card>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        handleClose={() => setIsConfirmationModalOpen(false)}
        title={confirmationModalTitle}
        description={confirmationModalDescription}
        onConfirm={() => {
          onConfirmAction();
          setIsConfirmationModalOpen(false);
        }}
        actionType={actionType}
      />
      <Backdrop
        sx={{ color: "#ff4", backgroundImage: "linear-gradient(135deg, #ced4da  0%, #ebeff4 100%)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <DNA
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </Backdrop>
    </DashboardLayout>
  );
}
