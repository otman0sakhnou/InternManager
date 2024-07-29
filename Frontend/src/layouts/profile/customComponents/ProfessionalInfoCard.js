import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import TextField from "@mui/material/TextField";
import useStagiaireStore from "store/InternStore";
import useCollaboratorStore from "store/collaboratorStore";
import { FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { InputAdornment } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import StyledIcon from "components/StyledIcon";

function ProfessionalInfoCard({ title, info, action, role }) {
  const infoRespectingFormCreation = {
    id: info.id,
    educationInfo: {
      institution: info.institution,
      level: info.level,
      specialization: info.specialization,
      yearOfStudy: info.yearOfStudy,
    },
    internshipInfo: {
      title: info.title,
      department: info.department,
      startDate: info.startDate,
      endDate: info.endDate,
    },
  };

  const [editable, setEditable] = useState(false);
  const [editableInfo, setEditableInfo] = useState(
    role === "intern" ? infoRespectingFormCreation : info
  );

  const updateStagiaire = useStagiaireStore((state) => state.updateStagiaire);
  const updateCollaborator = useCollaboratorStore((state) => state.updateCollaborator);

  const intern = useStagiaireStore((state) =>
    state.getStagiaireById(infoRespectingFormCreation.id)
  );
  const collaborator = useCollaboratorStore((state) => state.getCollaboratorById(info.id));

  useEffect(() => {
    setEditableInfo(role === "intern" ? infoRespectingFormCreation : info);
  }, [role]);

  const originalData = role === "intern" ? intern : collaborator;

  const toggleEdit = () => {
    if (editable) {
      handleSave();
    }
    setEditable(!editable);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prevInfo) => {
      const updatedInfo = { ...prevInfo };
      const keys = name.split(".");
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) {
          acc[key] = value;
        } else {
          if (!acc[key]) acc[key] = {};
          return acc[key];
        }
      }, updatedInfo);
      return updatedInfo;
    });
  };

  const handleDateChange = (name, date) => {
    setEditableInfo((prevInfo) => {
       const updatedInfo = { ...prevInfo };
       const keys = name.split(".");
       keys.reduce((acc, key, index) => {
         if (index === keys.length - 1) {
           acc[key] = date ? date.format("YYYY-MM-DD") : "";
         } else {
           if (!acc[key]) acc[key] = {};
           return acc[key];
         }
       }, updatedInfo);
       return updatedInfo;
    });
  };

  const handleSave = () => {
    if (role === "intern") {
      const updatedData = { ...originalData, ...editableInfo };
      updateStagiaire(updatedData);
    } else if (role === "collaborator") {
      const updatedData = { ...originalData, ...editableInfo };
      updateCollaborator(updatedData);
    }
  };

  const renderEditableField = (label, value, key) => (
    <SoftBox key={key} display="flex" py={1} pr={2}>
      <SoftTypography
        variant="button"
        fontWeight="bold"
        textTransform="capitalize"
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}: &nbsp;
      </SoftTypography>
      <TextField
        name={key}
        variant="outlined"
        size="small"
        value={value || ""}
        onChange={handleInputChange}
        fullWidth
      />
    </SoftBox>
  );

  const renderEditableDateField = (label, value, key) => (
    <SoftBox key={key} display="flex" py={1} pr={2}>
      <SoftTypography
        variant="button"
        fontWeight="bold"
        textTransform="capitalize"
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}: &nbsp;
      </SoftTypography>
      <FormControl fullWidth>
        <DatePicker
          value={dayjs(value || null)}
          onChange={(date) => handleDateChange(key, date)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              fullWidth
              placeholder={label}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon>
                      <CalendarToday />
                    </StyledIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </FormControl>
    </SoftBox>
  );

  const renderEditableSelectField = (label, value, key, options) => (
    <SoftBox key={key} display="flex" py={1} pr={2}>
      <SoftTypography
        variant="button"
        fontWeight="bold"
        textTransform="capitalize"
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}: &nbsp;
      </SoftTypography>
      <FormControl fullWidth variant="outlined">
        <Select
          startAdornment={
            <InputAdornment position="start">
              <StyledIcon>apartment_icon</StyledIcon>
            </InputAdornment>
          }
          name={key}
          value={value || ""}
          onChange={handleInputChange}
          displayEmpty
          variant="outlined"
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#CCCCCC" }}>{label}</span>;
            }
            return selected;
          }}
        >
          <MenuItem value="" disabled>
            {label}
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </SoftBox>
  );

  const renderField = (label, value, key) => (
    <SoftBox key={key} display="flex" py={1} pr={2}>
      <SoftTypography
        variant="button"
        fontWeight="bold"
        textTransform="capitalize"
        sx={{ whiteSpace: "nowrap" }}
      >
        {label}: &nbsp;
      </SoftTypography>
      <SoftTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{value}
      </SoftTypography>
    </SoftBox>
  );

  const renderItems = () => {
    if (role === "collaborator") {
      return (
        <>
          <SoftTypography variant="button" color="text" fontWeight="regular" mb={2} lineHeight={1}>
            This section provides information about the collaborator&apos;s professional details.
          </SoftTypography>
          {editable
            ? renderEditableField("Job", editableInfo.job, "job")
            : renderField("Job", editableInfo.job, "job")}
          {editable
            ? renderEditableSelectField("Department", editableInfo.department, "department", [
                { value: "Microsoft&Data", label: "Microsoft & Data" },
                { value: "Front&Mobile", label: "Front & Mobile" },
                { value: "Java", label: "Java" },
                { value: "PHP", label: "PHP" },
                { value: "Devops", label: "Devops" },
                { value: "Test&Support", label: "Test & Support" },
              ])
            : renderField("Department", editableInfo.department, "department")}
          {editable
            ? renderEditableField("Organization", editableInfo.organization, "organization")
            : renderField("Organization", editableInfo.organization, "organization")}
          {editable
            ? renderEditableDateField(
                "Employment Date",
                editableInfo.employmentDate,
                "employmentDate"
              )
            : renderField("Employment Date", editableInfo.employmentDate, "employmentDate")}
        </>
      );
    } else if (role === "intern") {
      return (
        <>
          <SoftTypography
            variant="button"
            color="text"
            fontWeight="regular"
            mb={2}
            lineHeight={1.5}
          >
            This section provides information about the intern&apos;s education and internship
            details.
          </SoftTypography>
          <SoftTypography
            variant="h6"
            fontWeight="medium"
            mt={2}
            sx={{ textDecoration: "underline" }}
          >
            Education Information
          </SoftTypography>
          {editable
            ? renderEditableField(
                "Institution",
                editableInfo.educationInfo.institution,
                "educationInfo.institution"
              )
            : renderField(
                "Institution",
                editableInfo.educationInfo.institution,
                "educationInfo.institution"
              )}
          {editable
            ? renderEditableField("Level", editableInfo.educationInfo.level, "educationInfo.level")
            : renderField("Level", editableInfo.educationInfo.level, "educationInfo.level")}
          {editable
            ? renderEditableField(
                "Specialization",
                editableInfo.educationInfo.specialization,
                "educationInfo.specialization"
              )
            : renderField(
                "Specialization",
                editableInfo.educationInfo.specialization,
                "educationInfo.specialization"
              )}
          {editable
            ? renderEditableField(
                "Year of Study",
                editableInfo.educationInfo.yearOfStudy,
                "educationInfo.yearOfStudy"
              )
            : renderField(
                "Year of Study",
                editableInfo.educationInfo.yearOfStudy,
                "educationInfo.yearOfStudy"
              )}

          <SoftTypography
            variant="h6"
            fontWeight="medium"
            mt={2}
            sx={{ textDecoration: "underline" }}
          >
            Internship Information
          </SoftTypography>
          {editable
            ? renderEditableField(
                "Title",
                editableInfo.internshipInfo.title,
                "internshipInfo.title"
              )
            : renderField("Title", editableInfo.internshipInfo.title, "internshipInfo.title")}
          {editable
            ? renderEditableSelectField(
                "Department",
                editableInfo.internshipInfo.department,
                "internshipInfo.department",
                [
                  { value: "Microsoft&Data", label: "Microsoft & Data" },
                  { value: "Front&Mobile", label: "Front & Mobile" },
                  { value: "Java", label: "Java" },
                  { value: "PHP", label: "PHP" },
                  { value: "Devops", label: "Devops" },
                  { value: "Test&Support", label: "Test & Support" },
                ]
              )
            : renderField(
                "Department",
                editableInfo.internshipInfo.department,
                "internshipInfo.department"
              )}
          {editable
            ? renderEditableDateField(
                "Start Date",
                editableInfo.internshipInfo.startDate,
                "internshipInfo.startDate"
              )
            : renderField(
                "Start Date",
                editableInfo.internshipInfo.startDate,
                "internshipInfo.startDate"
              )}
          {editable
            ? renderEditableDateField(
                "End Date",
                editableInfo.internshipInfo.endDate,
                "internshipInfo.endDate"
              )
            : renderField(
                "End Date",
                editableInfo.internshipInfo.endDate,
                "internshipInfo.endDate"
              )}
        </>
      );
    }
  };

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        <Tooltip title={editable ? "Save" : action.tooltip} placement="top">
          <Icon onClick={toggleEdit} style={{ cursor: "pointer" }}>
            {editable ? "save" : "edit"}
          </Icon>
        </Tooltip>
      </SoftBox>
      <SoftBox px={2} pb={2}>
        <SoftBox mt={2}>{renderItems()}</SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the ProfessionalInfoCard
ProfessionalInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.shape({
    id: PropTypes.string.isRequired,
    job: PropTypes.string,
    department: PropTypes.string,
    organization: PropTypes.string,
    employmentDate: PropTypes.string,
    institution: PropTypes.string,
    level: PropTypes.string,
    specialization: PropTypes.string,
    yearOfStudy: PropTypes.string,
    title: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  role: PropTypes.oneOf(["collaborator", "intern"]).isRequired,
};

export default ProfessionalInfoCard;
