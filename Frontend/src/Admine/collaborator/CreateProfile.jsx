import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Box, TextField, InputAdornment, Card, MenuItem, Select, FormHelperText, FormControl, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LockIcon from '@mui/icons-material/Lock';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import StyledIcon from "components/StyledIcon";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useValidationStore from "store/useValidationStore ";
import dayjs from 'dayjs';
import useCollaboratorStore from "store/collaboratorStore";
import { validate, validationSchemas } from "utils/validation";


const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, #2152ff 0%, #21d4fd 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, #2152ff 0%, #21d4fd 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));
const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient(136deg, #2152ff 0%, #21d4fd 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient(136deg, #2152ff 0%, #21d4fd 100%)',
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

const steps = ['Personal Information', 'Organization Details', 'Account Setup'];

export default function CreateProfile() {
  const [activeStep, setActiveStep] = React.useState(0);
  const addCollaborator = useCollaboratorStore((state) => state.addCollaborator);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    job: "",
    department: "",
    organization: "",
    employementDate: null,
    password: "",
    confirmPassword: "",
  });

  const { errors, setErrors } = useValidationStore();

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
        job: validationSchemas.job,
        employementDate: validationSchemas.employementDate,
      };
    } else if (step === 2) {
      return {
        password: validationSchemas.password,
        confirmPassword: validationSchemas.confirmPassword,
      };
    }
  };
  const submit = () => {
    addCollaborator(formData);
    alert('Collaborator added successfully!');
  };

  const handleNext = () => {
    const schema = getActiveStepSchema(activeStep);
    const newErrors = validate(formData, schema);

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      if (activeStep === steps.length - 1) {
        submit();
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, employementDate: date ? dayjs(date).format('YYYY-MM-DD') : null });
  };
  const handleGenderChange = (event) => {
    setFormData({ ...formData, gender: event.target.value });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ p: 4, m: 2, borderRadius: 4, boxShadow: 3 }}>
        <Stack sx={{ my: 5, width: '100%' }} spacing={4}>
          <SoftTypography
            textAlign="center"
            variant="h3" fontWeight="bold" color="dark" textGradient
          >
            Set up a Profile for the Collaborator
          </SoftTypography>
          <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon} StepIconProps={{ icon: index + 1 }}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            return <span style={{ color: "#CCCCCC" }}>Select collaborator&apos;s gender</span>;
                          }
                          return selected;
                        }}
                        startAdornment={
                          <InputAdornment style={{ fontSize: 16, color: "#344767" }} position="start">
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
                      {!!errors.gender && (
                        <FormHelperText error>{errors.gender}</FormHelperText>
                      )}
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
                    <FormControl fullWidth >
                      <Select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        displayEmpty
                        variant="outlined"
                        error={!!errors.department}
                        helperText={errors.department}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <span style={{ color: "#CCCCCC" }}>Select internship department</span>;
                          }
                          return selected;
                        }}
                        startAdornment={
                          <InputAdornment style={{ fontSize: 16, color: "#344767" }} position="start">
                            <StyledIcon>apartment</StyledIcon>
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="" disabled>
                          Select internship department
                        </MenuItem>
                        <MenuItem value="Microsoft&Data">Microsoft & Data</MenuItem>
                        <MenuItem value="Front&Mobile">Front & Mobile</MenuItem>
                        <MenuItem value="Java">Java</MenuItem>
                        <MenuItem value="PHP">PHP</MenuItem>
                        <MenuItem value="Devops">Devops</MenuItem>
                        <MenuItem value="Test&Support">Test & Support</MenuItem>
                      </Select>
                      {!!errors.department && <FormHelperText error>{errors.department}</FormHelperText>}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      placeholder="Title"
                      name="Title"
                      value={formData.job}
                      onChange={handleInputChange}
                      error={!!errors.job}
                      helperText={errors.job}
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
                    <FormControl fullWidth error={!!errors.employementDate}>
                      <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                        <DatePicker
                          placeholder="Employment Date"
                          value={formData.employementDate ? dayjs(formData.employementDate) : null}
                          onChange={handleDateChange}
                        />
                        {errors.employementDate && <FormHelperText p={2} error>{errors.employementDate}</FormHelperText>}
                      </LocalizationProvider>
                    </FormControl>

                  </Grid>
                  <Grid container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    margin={2}>
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
                  <Grid item xs={6}>
                    <TextField
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      fullWidth
                      variant="outlined"
                      type="password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledIcon>lock</StyledIcon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      fullWidth
                      variant="outlined"
                      type="password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledIcon>lock</StyledIcon>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    margin={2}>
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
    </DashboardLayout>
  );
}
