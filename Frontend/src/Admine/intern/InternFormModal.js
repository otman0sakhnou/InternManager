import React, { useState, useEffect } from "react";
import FormHelperText from "@mui/material/FormHelperText";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ReusableModal from "components/ReusableModal";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Work,
  School,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import dayjs from "dayjs";

function InternFormModal({ open, onClose, onAddIntern, intern }) {
  const [internName, setInternName] = useState("");
  const [internEmail, setInternEmail] = useState("");
  const [internPhone, setInternPhone] = useState("");
  const [internBirthdate, setInternBirthdate] = useState(dayjs());
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
  const [accountInfo, setAccountInfo] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (intern) {
      setInternName(intern.name || "");
      setInternEmail(intern.email || "");
      setInternPhone(intern.phone || "");
      setInternBirthdate(dayjs(intern.birthdate) || dayjs());
      setInternGender(intern.gender || "");
      setEducationInfo(
        intern.educationInfo || {
          institution: "",
          level: "",
          specialization: "",
          yearOfStudy: "",
        }
      );
      setInternshipInfo(
        intern.internshipInfo || {
          title: "",
          department: "",
          startDate: dayjs(),
          endDate: dayjs(),
        }
      );
      setAccountInfo(
        intern.accountInfo || {
          username: "",
          password: "",
        }
      );
    } else {
      resetForm();
    }
  }, [intern]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Adjust this regex according to your phone number format
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!internName) newErrors.internName = "Full Name is required";
    if (!internEmail) newErrors.internEmail = "Email is required";
    else if (!validateEmail(internEmail)) newErrors.internEmail = "Invalid email format";
    if (!internPhone) newErrors.internPhone = "Phone number is required";
    else if (!validatePhone(internPhone)) newErrors.internPhone = "Invalid phone number format";
    if (!internBirthdate) {
      newErrors.internBirthdate = "Birthdate is required";
    } else {
      const today = dayjs();
      if (dayjs(internBirthdate).isAfter(today)) {
        newErrors.internBirthdate = "Birthdate cannot be in the future";
      }
    }
    if (!internGender) newErrors.internGender = "Gender is required";
    if (!educationInfo.institution) newErrors.institution = "Institution is required";
    if (!educationInfo.level) newErrors.level = "Level is required";
    if (!educationInfo.specialization) newErrors.specialization = "Specialization is required";
    const yearRegex = /^\d{4}$/; // Regex pour vérifier le format yyyy

    if (!educationInfo.yearOfStudy) {
      newErrors.yearOfStudy = "Year of study is required";
    } else if (!yearRegex.test(educationInfo.yearOfStudy)) {
      newErrors.yearOfStudy = "Year of study must be in the  format yyyy (For exampl, 2024)";
    }
    if (!internshipInfo.title) newErrors.title = "Internship Title is required";
    if (!internshipInfo.department) newErrors.department = "Department is required";
    if (!internshipInfo.startDate) newErrors.startDate = "Start Date is required";
    if (!internshipInfo.endDate) newErrors.endDate = "End Date is required";
    if (internshipInfo.startDate && internshipInfo.endDate) {
      if (dayjs(internshipInfo.endDate).isBefore(dayjs(internshipInfo.startDate))) {
        newErrors.endDate = "End Date must be after Start Date";
      }
    }
    if (!accountInfo.username) newErrors.username = "Username is required";
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!accountInfo.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(accountInfo.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, including one number, one uppercase, one lowercase letter, and one special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retourne true si aucune erreur n'est trouvée
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const updatedIntern = {
      ...intern,
      name: internName,
      email: internEmail,
      phone: internPhone,
      birthdate: internBirthdate,
      gender: internGender,
      avatar: generateAvatar(internName),
      educationInfo: { ...educationInfo },
      internshipInfo: { ...internshipInfo },
      accountInfo: { ...accountInfo },
    };

    onAddIntern(updatedIntern);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setInternName("");
    setInternEmail("");
    setInternPhone("");
    setInternBirthdate(dayjs());
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
    setAccountInfo({
      username: "",
      password: "",
    });
    setErrors({});
  };

  const generateAvatar = (name) => {
    if (!name) return "";
    const initiales = name
      .split(" ")
      .map((name) => name[0])
      .join("");
    return initiales; // Retourne les initiales comme chaîne de caractères
  };

  const modalBody = (
    <Box sx={{ p: 0 }}>
      <Typography variant="h6" sx={{ color: "#1976d2", marginBottom: 2 }}>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            id="intern-name"
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={internName}
            onChange={(e) => setInternName(e.target.value)}
            error={!!errors.internName}
            helperText={errors.internName}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's Full name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="intern-email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={internEmail}
            onChange={(e) => setInternEmail(e.target.value)}
            error={!!errors.internEmail}
            helperText={errors.internEmail}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="intern-phone"
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={internPhone}
            onChange={(e) => setInternPhone(e.target.value)}
            error={!!errors.internPhone}
            helperText={errors.internPhone}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's phone number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl label="Birthdate" fullWidth margin="normal" error={!!errors.internBirthdate}>
            <DatePicker
              label="Birthdate"
              value={internBirthdate ? dayjs(internBirthdate) : null}
              onChange={(date) => {
                console.log("DatePicker value:", date);
                setInternBirthdate(date ? date.format("YYYY-MM-DD") : "");
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true, style: { color: "#1976d2" } }}
                  error={!!errors.internBirthdate}
                />
              )}
            />
            {!!errors.internBirthdate && <FormHelperText>{errors.internBirthdate}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal" error={!!errors.internGender}>
            <InputLabel id="intern-gender-label" shrink={true} style={{ color: "primary" }}>
              Gender
            </InputLabel>
            <Select
              labelId="intern-gender-label"
              id="intern-gender"
              value={internGender}
              onChange={(e) => setInternGender(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <span style={{ color: "#CCCCCC" }}>Enter intern&apos;s gender</span>;
                }
                return selected;
              }}
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Enter intern&apos;s gender
              </MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {!!errors.internGender && (
              <FormHelperText error>{errors.internGender}</FormHelperText> // Use FormHelperText for consistency
            )}
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ color: "#1976d2", marginTop: 2, marginBottom: 2 }}>
        Education Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            id="education-institution"
            label="Institution"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={educationInfo.institution}
            onChange={(e) => setEducationInfo({ ...educationInfo, institution: e.target.value })}
            error={!!errors.institution}
            helperText={errors.institution}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's educational institution"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <School />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="education-level"
            label="Level"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={educationInfo.level}
            onChange={(e) => setEducationInfo({ ...educationInfo, level: e.target.value })}
            error={!!errors.level}
            helperText={errors.level}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's education level"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="education-specialization"
            label="Specialization"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={educationInfo.specialization}
            onChange={(e) => setEducationInfo({ ...educationInfo, specialization: e.target.value })}
            error={!!errors.specialization}
            helperText={errors.specialization}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's education specialization"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work />
                </InputAdornment>
              ),
            }}
          />
        </Grid>{" "}
        <Grid item xs={12} md={6}>
          <TextField
            id="education-year"
            label="Year of Study"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={educationInfo.yearOfStudy}
            onChange={(e) => setEducationInfo({ ...educationInfo, yearOfStudy: e.target.value })}
            error={!!errors.yearOfStudy}
            helperText={errors.yearOfStudy}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter intern's year of study"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ color: "#1976d2", marginTop: 2, marginBottom: 2 }}>
        Internship Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            id="internship-title"
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={internshipInfo.title}
            onChange={(e) => setInternshipInfo({ ...internshipInfo, title: e.target.value })}
            error={!!errors.title}
            helperText={errors.title}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter internship title"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Work />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.department}>
            <InputLabel id="internship-department-label" shrink={true} style={{ color: "primary" }}>
              Department
            </InputLabel>
            <Select
              labelId="internship-department-label"
              id="internship-department"
              value={internshipInfo.department}
              onChange={(e) => setInternshipInfo({ ...internshipInfo, department: e.target.value })}
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
          <FormControl fullWidth margin="normal" error={!!errors.startDate}>
            <DatePicker
              label="Start Date"
              value={internshipInfo.startDate ? dayjs(internshipInfo.startDate) : null}
              onChange={(date) =>
                setInternshipInfo({
                  ...internshipInfo,
                  startDate: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.startDate}
                  placeholder="Select start date"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            {!!errors.startDate && <FormHelperText>{errors.startDate}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" error={!!errors.endDate}>
            <DatePicker
              label="End Date"
              value={internshipInfo.endDate ? dayjs(internshipInfo.endDate) : null}
              onChange={(date) =>
                setInternshipInfo({
                  ...internshipInfo,
                  endDate: date ? date.format("YYYY-MM-DD") : "",
                })
              }
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  error={!!errors.endDate}
                  placeholder="Select end date"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            {!!errors.endDate && <FormHelperText>{errors.endDate}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant="h6" sx={{ color: "#1976d2", marginTop: 2, marginBottom: 2 }}>
        Account Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            id="account-username"
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={accountInfo.username}
            onChange={(e) => setAccountInfo({ ...accountInfo, username: e.target.value })}
            error={!!errors.username}
            helperText={errors.username}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="account-password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{ marginBottom: 2 }}
            value={accountInfo.password}
            onChange={(e) => setAccountInfo({ ...accountInfo, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
            InputLabelProps={{ shrink: true, style: { color: "primary" } }}
            placeholder="Enter password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReusableModal
        open={open}
        onClose={onClose}
        modalTitle={intern ? "Edit Intern" : "Add Intern"}
        modalBody={modalBody}
        onSaveChanges={handleSubmit}
        cancelButtonText="Cancel"
        saveButtonText={intern ? "Update" : "Save"}
      />
    </LocalizationProvider>
  );
}

InternFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddIntern: PropTypes.func.isRequired,
  intern: PropTypes.object,
};
InternFormModal.defaultProps = {
  intern: null,
};

export default InternFormModal;
