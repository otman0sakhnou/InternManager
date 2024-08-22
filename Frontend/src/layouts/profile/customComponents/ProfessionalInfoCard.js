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
import { Backdrop, FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { InputAdornment } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import { MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import StyledIcon from "components/StyledIcon";
import { validationSchemas, validate } from "utils/validation";
import flattenObject from "utils/flattenObject";
import useValidationStore from "store/useValidationStore";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/ConfirmationModals";
import { DNA } from "react-loader-spinner";

function ProfessionalInfoCard({ title, info, action, role }) {
  const infoRespectingFormCreation = {
    id: info.id,
    institution: info.institution,
    level: info.level,
    specialization: info.specialization,
    yearOfStudy: info.yearOfStudy,
    title: info.title,
    department: info.department,
    startDate: info.startDate,
    endDate: info.endDate,

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
  const collaborator = useCollaboratorStore((state) => state.getCollaborator(info.id));

  const { errors, setErrors } = useValidationStore();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setEditableInfo(role === "intern" ? infoRespectingFormCreation : info);
  }, [role]);

  const originalData = role === "intern" ? intern : collaborator;

  const getActiveSchema = () => {
    if (role === "intern") {
      return {
        "institution": validationSchemas.institution,
        "level": validationSchemas.level,
        "specialization": validationSchemas.specialization,
        "yearOfStudy": validationSchemas.yearOfStudy,
        "title": validationSchemas.title,
        "department": validationSchemas.department,
        "startDate": validationSchemas.startDate,
        "endDate": validationSchemas.endDate,
      };
    } else if (role === "collaborator") {
      return {
        organization: validationSchemas.organization,
        department: validationSchemas.department,
        title: validationSchemas.title,
        employmentDate: validationSchemas.employmentDate,
      };
    } else {
      return {}
    }
  }

  const toggleEdit = () => {
    if (editable) {
      const schema = getActiveSchema();
      console.log(schema);
      console.log(editableInfo)
      const flattenedInfo = flattenObject(editableInfo)
      const newErrors = validate(flattenedInfo, schema);
      console.log(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // handleSave();
        // setEditable(false);
      } else {
        setErrors({});
        handleSave();
        setEditable(false);
      }
    } else {
      setEditable(true);
    }
  };
  const handleSave = () => {

    if (role === "intern") {
      console.log("Intern role detected");

      setConfirmationModalTitle("Update Intern");

      setConfirmationModalDescription("Are you sure you want to update this intern?");
      setOnConfirmAction(() => () => {
        const updatedData = { ...originalData, ...editableInfo };
        updateStagiaire(updatedData);
        setErrors({});
        toast.success("Intern updated successfully!");
      });
      setIsConfirmationModalOpen(true);
    } else if (role === "collaborator") {


      setConfirmationModalTitle("Update Collaborator");
      setConfirmationModalDescription("Are you sure you want to update this collab?");
      setOnConfirmAction(() => async () => {
        const updatedData = { ...originalData, ...editableInfo };
        setLoading(true);
        try {
          await updateCollaborator(updatedData.id, updatedData);
          setErrors({});
          toast.success("Collaborator updated successfully!");
        } catch (error) {
          toast.error("Failed to updated collaborator: " + error.message);
          console.log(error);
          console.log("updated collaborator : ", updatedData)
        } finally {
          setLoading(false);
        }
      });
      setIsConfirmationModalOpen(true);


    };
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
        error={!!errors[key]}
        helperText={errors[key] || ""}
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
              error={!!errors[key]}
              helperText={errors[key] || ""}
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
          error={!!errors[key]}
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
        {errors[key] && <SoftTypography color="error">{errors[key]}</SoftTypography>}
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
        {label} : &nbsp;
      </SoftTypography>
      <SoftTypography variant="button" fontWeight="regular" color="text">
        &nbsp;{value || "Not provided"} {/* Add a fallback value */}
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
            ? renderEditableField("title", editableInfo.title, "job")
            : renderField("title", editableInfo.title, "job")}
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
              editableInfo.institution,
              "institution"
            )
            : renderField(
              "Institution",
              editableInfo.institution,
              "institution"
            )}
          {editable
            ? renderEditableField("Level", editableInfo.level, "level")
            : renderField("Level", editableInfo.level, "level")}
          {editable
            ? renderEditableField(
              "Specialization",
              editableInfo.specialization,
              "specialization"
            )
            : renderField(
              "Specialization",
              editableInfo.specialization,
              "specialization"
            )}
          {editable
            ? renderEditableField(
              "Year of Study",
              editableInfo.yearOfStudy,
              "yearOfStudy"
            )
            : renderField(
              "Year of Study",
              editableInfo.yearOfStudy,
              "yearOfStudy"
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
              editableInfo.title,
              "title"
            )
            : renderField("Title", editableInfo.title, "title")}
          {editable
            ? renderEditableSelectField(
              "Department",
              editableInfo.department,
              "department",
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
              editableInfo.department,
              "department"
            )}
          {editable
            ? renderEditableDateField(
              "Start Date",
              editableInfo.startDate,
              "startDate"
            )
            : renderField(
              "Start Date",
              dayjs(editableInfo.startDate).format("YYYY-MM-DD"),
              "startDate"
            )}
          {editable
            ? renderEditableDateField(
              "End Date",
              editableInfo.endDate,
              "endDate"
            )
            : renderField(
              "End Date",
              dayjs(editableInfo.endDate).format("YYYY-MM-DD"),
              "endDate"
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
