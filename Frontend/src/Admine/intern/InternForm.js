import * as React from "react";
import { useState } from "react";
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
  Typography,
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
import useValidationStore from "../../store/useValidationStore";
import dayjs from "dayjs";
import useCollaboratorStore from "store/collaboratorStore";
import SoftBox from "components/SoftBox";
import InputLabel from "@mui/material/InputLabel";
import WcIcon from "@mui/icons-material/Wc";
import { Grid } from "@mui/material";
import { CalendarToday, Work, School, AccountCircle, Lock } from "@mui/icons-material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { validate, validationSchemas } from "../../utils/validation";
import useStagiaireStore from "./InternStore";
import { OutlinedInput } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// Import the icon you want to use
import { IconButton } from "@mui/material";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg, rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
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
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
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

const steps = ["Personal Information", "Education Details", "Internship Details"];

export default function CreateProfile() {
  const stagiaires = useStagiaireStore((state) => state.stagiaires)
  console.log(stagiaires);

  const [activeStep, setActiveStep] = React.useState(0);
  const [internName, setInternName] = useState("");
  const [internEmail, setInternEmail] = useState("");
  const [internPhone, setInternPhone] = useState("");
  // const [internBirthdate, setInternBirthdate] = useState(dayjs());
  const [internGender, setInternGender] = useState("");
  const [educationInfo, setEducationInfo] = useState({
    institution: "",
    level: "",
    specialization: "",
    yearOfStudy: "",
  });
  const [internshipInfo, setInternshipInfo] = useState({
    title: "",
    department: "",
    startDate: dayjs(),
    endDate: dayjs(),
  });
  // const [accountInfo, setAccountInfo] = useState({
  //   username: "",
  //   password: "",
  // });

  const addStagiaire = useStagiaireStore((state) => state.addStagiaire);
  const { errors, setErrors } = useValidationStore();

  const handleSubmit = () => {
    // if (!validateForm()) return;

    const updatedIntern = {
      name: internName,
      email: internEmail,
      phone: internPhone,
      gender: internGender,
      avatar: "",
      educationInfo: { ...educationInfo },
      internshipInfo: { ...internshipInfo },
    };

    addStagiaire(updatedIntern);
    resetForm();
  };

  const resetForm = () => {
    setInternName("");
    setInternEmail("");
    setInternPhone("");
    setInternGender("");
    setEducationInfo({
      institution: "",
      level: "",
      specialization: "",
      yearOfStudy: "",
    });
    setInternshipInfo({
      title: "",
      department: "",
      startDate: dayjs(),
      endDate: dayjs(),
    });
    setErrors({});
  };

  // Validation function

  // const newErrors = validate(values, schemas);
  // setErrors(newErrors);
  // return Object.keys(newErrors).length === 0;

  const getActiveStepSchema = (step) => {
    if (step === 0) {
      console.log(step);
      // Schema for Personal Information
      return {
        internName: validationSchemas.internName,
        internEmail: validationSchemas.internEmail,
        internPhone: validationSchemas.internPhone,
        internGender: validationSchemas.internGender,
      };
    } else if (step === 1) {
       console.log(step);
      // Schema for Education Information
      return {
        institution: validationSchemas.institution,
        level: validationSchemas.level,
        specialization: validationSchemas.specialization,
        yearOfStudy: validationSchemas.yearOfStudy,
      };
    } else if (step === 2) {
       console.log(step);
      // Schema for Internship Details
      console.log("************************");
      console.log(internshipInfo);
      return {
        title: validationSchemas.title,
        department: validationSchemas.department,
        startDate: validationSchemas.startDate,
        endDate: validationSchemas.endDate,
      };
    }
  };

  const handleNext = () => {
    const schema = getActiveStepSchema(activeStep);
    const newErrors = validate(
      activeStep === 0
        ? { internName, internEmail, internPhone, internGender }
        : activeStep === 1
        ? educationInfo
        : internshipInfo,
      schema
    );

    // if (activeStep === steps.length - 1) {
    //   handleSubmit();
    // } else {
    //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // }
    console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      if (activeStep === steps.length - 1) {
        handleSubmit();
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

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleDateChange = (date) => {
  //   setFormData({ ...formData, employementDate: date ? dayjs(date).format("YYYY-MM-DD") : null });
  // };
  // const handleJobChange = (event) => {
  //   setFormData({ ...formData, job: event.target.value });
  // };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardLayout>
        <DashboardNavbar />
        <Card sx={{ p: 4, m: 2, borderRadius: 4, boxShadow: 3 }}>
          <Stack sx={{ my: 5, width: "100%" }} spacing={4}>
            <SoftTypography
              variant="h3"
              textAlign="center"
              color="dark"
              sx={{ fontWeight: "bold", mb: 3, textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
            >
              Set up a profile for an intern
            </SoftTypography>
            <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={ColorlibStepIcon}
                    StepIconProps={{ icon: index + 1 }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
              <Box sx={{ width: "60%", display: "flex", flexDirection: "column", gap: 2 }}>
                {activeStep === 0 && (
                  <Grid container spacing={3} padding={4}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        id="intern-name"
                        variant="outlined"
                        fullWidth
                        value={internName}
                        onChange={(e) => setInternName(e.target.value)}
                        error={!!errors.internName}
                        helperText={errors.internName}
                        InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                        placeholder="Full name"
                        name="intern-name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledIcon>person</StyledIcon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="intern-email"
                        id="intern-email"
                        variant="outlined"
                        fullWidth
                        value={internEmail}
                        onChange={(e) => setInternEmail(e.target.value)}
                        error={!!errors.internEmail}
                        helperText={errors.internEmail}
                        InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                        placeholder="Email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledIcon>email</StyledIcon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="intern-phone"
                        id="intern-phone"
                        variant="outlined"
                        fullWidth
                        value={internPhone}
                        onChange={(e) => setInternPhone(e.target.value)}
                        error={!!errors.internPhone}
                        helperText={errors.internPhone}
                        InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                        placeholder="Phone Number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <StyledIcon>phone</StyledIcon>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.internGender} variant="outlined">
                        <Select
                          labelId="intern-gender-label"
                          id="intern-gender"
                          value={internGender}
                          onChange={(e) => setInternGender(e.target.value)}
                          displayEmpty
                          startAdornment={
                            <InputAdornment position="start">
                              <StyledIcon>wc_icon</StyledIcon>
                            </InputAdornment>
                          }
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#CCCCCC" }}>Gender</span>;
                            }
                            return selected;
                          }}
                        >
                          <MenuItem value="" disabled>
                            Gender
                          </MenuItem>
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </Select>
                        {!!errors.internGender && (
                          <FormHelperText>{errors.internGender}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box justifyContent="end" display="flex" alignItems="center" paddingTop={2}>
                        <SoftButton variant="gradient" color="info" onClick={handleNext}>
                          Next
                        </SoftButton>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                {activeStep === 1 && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="education-institution"
                          variant="outlined"
                          fullWidth
                          value={educationInfo.institution}
                          onChange={(e) =>
                            setEducationInfo({ ...educationInfo, institution: e.target.value })
                          }
                          error={!!errors.institution}
                          helperText={errors.institution}
                          InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                          placeholder="Educational Institution"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledIcon>school</StyledIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="education-level"
                          variant="outlined"
                          fullWidth
                          value={educationInfo.level}
                          onChange={(e) =>
                            setEducationInfo({ ...educationInfo, level: e.target.value })
                          }
                          error={!!errors.level}
                          helperText={errors.level}
                          InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                          placeholder="Education Level"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledIcon>work</StyledIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="education-specialization"
                          variant="outlined"
                          fullWidth
                          value={educationInfo.specialization}
                          onChange={(e) =>
                            setEducationInfo({ ...educationInfo, specialization: e.target.value })
                          }
                          error={!!errors.specialization}
                          helperText={errors.specialization}
                          InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                          placeholder="Education Specialization"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledIcon>work</StyledIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>{" "}
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="education-year"
                          variant="outlined"
                          fullWidth
                          value={educationInfo.yearOfStudy}
                          onChange={(e) =>
                            setEducationInfo({ ...educationInfo, yearOfStudy: e.target.value })
                          }
                          error={!!errors.yearOfStudy}
                          helperText={errors.yearOfStudy}
                          InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                          placeholder="Year of Study"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <StyledIcon>calendar_today</StyledIcon>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="end">
                      <SoftButton variant="gradient" color="dark" onClick={handleBack}>
                        Previous
                      </SoftButton>
                      <SoftButton variant="gradient" color="info" onClick={handleNext}>
                        Next
                      </SoftButton>
                    </SoftBox>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          id="internship-title"
                          variant="outlined"
                          fullWidth
                          sx={{ marginBottom: 2 }}
                          value={internshipInfo.title}
                          onChange={(e) =>
                            setInternshipInfo({ ...internshipInfo, title: e.target.value })
                          }
                          error={!!errors.title}
                          helperText={errors.title}
                          InputLabelProps={{ shrink: true, style: { color: "primary" } }}
                          placeholder="Internship Title"
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
                        <FormControl fullWidth error={!!errors.department} variant="outlined">
                          <Select
                            startAdornment={
                              <InputAdornment position="start">
                                <StyledIcon>apartment_icon</StyledIcon>
                              </InputAdornment>
                            }
                            labelId="internship-department-label"
                            id="internship-department"
                            value={internshipInfo.department}
                            onChange={(e) =>
                              setInternshipInfo({ ...internshipInfo, department: e.target.value })
                            }
                            displayEmpty
                            variant="outlined"
                            error={!!errors.department}
                            renderValue={(selected) => {
                              if (!selected) {
                                return (
                                  <span style={{ color: "#CCCCCC" }}>Internship Department</span>
                                );
                              }
                              return selected;
                            }}
                          >
                            <MenuItem value="" disabled>
                              Internship department
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
                      <Grid container spacing={2} marginLeft={1}>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#ffffff",
                              color: "#344767",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ textAlign: "right", marginRight: 1 }}>
                              Start:
                            </Typography>
                            <FormControl fullWidth error={!!errors.startDate}>
                              <DatePicker
                                value={
                                  internshipInfo.startDate ? dayjs(internshipInfo.startDate) : null
                                }
                                onChange={(date) =>
                                  setInternshipInfo({
                                    ...internshipInfo,
                                    startDate: date ? date.format("YYYY-MM-DD") : "",
                                  })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.startDate}
                                    placeholder="Start Date"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CalendarTodayIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                )}
                              />
                              {!!errors.startDate && (
                                <FormHelperText>{errors.startDate}</FormHelperText>
                              )}
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              backgroundColor: "#ffffff",
                              color: "#344767",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ textAlign: "right", marginRight: 1 }}>
                              End:
                            </Typography>
                            <FormControl fullWidth error={!!errors.endDate}>
                              <DatePicker
                                value={
                                  internshipInfo.endDate ? dayjs(internshipInfo.endDate) : null
                                }
                                onChange={(date) =>
                                  setInternshipInfo({
                                    ...internshipInfo,
                                    endDate: date ? date.format("YYYY-MM-DD") : "",
                                  })
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    fullWidth
                                    error={!!errors.endDate}
                                    placeholder="End Date"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <CalendarTodayIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                )}
                              />
                              {!!errors.endDate && (
                                <FormHelperText>{errors.endDate}</FormHelperText>
                              )}
                            </FormControl>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <SoftBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="end"
                      paddingTop={2}
                    >
                      <SoftButton variant="gradient" color="dark" onClick={handleBack}>
                        Previous
                      </SoftButton>
                      <SoftButton variant="gradient" color="info" onClick={handleNext}>
                        Finish
                      </SoftButton>
                    </SoftBox>
                  </>
                )}
              </Box>
            </Box>
          </Stack>
        </Card>
      </DashboardLayout>
    </LocalizationProvider>
  );
}
