import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import useStagiaireStore from "store/InternStore";
import useCollaboratorStore from "store/collaboratorStore";
import useAuthStore from "store/AuthStore";
import StyledIcon from "components/StyledIcon";
import { validationSchemas } from "utils/validation";
import { validate } from "utils/validation";
import useValidationStore from "store/useValidationStore";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/ConfirmationModals";

function CustomProfileInfoCard({ title, description, info, action, onUpdate }) {
  const { role } = useAuthStore(); // Adjust based on how your auth store returns role
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableInfo, setEditableInfo] = useState(info);
  const [editableDescription, setEditableDescription] = useState(description);

  const updateStagiaire = useStagiaireStore((state) => state.updateStagiaire);
  const intern = useStagiaireStore((state) => state.getStagiaireById(info.id));

  const updateCollaborator = useCollaboratorStore((state) => state.updateCollaborator);
  const collaborator = useCollaboratorStore((state) => state.getCollaboratorById(info.id));

  const { errors, setErrors } = useValidationStore();

  const data = role === "intern" ? intern : collaborator;

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });

  const handleEditClick = () => {
    if (isEditMode) {
      const schema = getActiveSchema();
      const newErrors = validate(editableInfo, schema);
      if (Object.keys(newErrors).length === 0) {
        setErrors({});
        handleSave();
        setIsEditMode(false); //only switch to view mode if there are no errors
      } else {
        setErrors(newErrors);
      }
      //handleSave();
    } else {
      setIsEditMode(true);
    }
  };

  const handleSave = () => {
    if (role === "intern") {

      setConfirmationModalTitle("Update Intern");
      setConfirmationModalDescription("Are you sure you want to update this intern?");
      setOnConfirmAction(() => () => {
        const updatedStagiaire = {
          ...data,
          ...editableInfo,
          description: editableDescription,
        };
        updateStagiaire(updatedStagiaire);
        setErrors({});
        toast.success("Intern updated successfully!");
      });
      setIsConfirmationModalOpen(true);

    } else if (role === "collaborator") {
      setConfirmationModalTitle("Update Collaborator");
      setConfirmationModalDescription("Are you sure you want to update this collab?");
      setOnConfirmAction(() => () => {
        const updatedCollaborator = {
          ...data,
          ...editableInfo,
          description: editableDescription,
        };
        updateCollaborator(updatedCollaborator);
        setErrors({});
        toast.success("Collab updated successfully!");
      });
      setIsConfirmationModalOpen(true);

    }
    if (onUpdate) {
      onUpdate(); // Call callback to update parent state
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo({
      ...editableInfo,
      [name]: value,
    });
  };

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  const getActiveSchema = () => {
    return {
      name: validationSchemas.name,
      phone: validationSchemas.phone,
      email: validationSchemas.email,
      gender: validationSchemas.gender,
    }
  }

  const filteredInfo =
    role === "intern"
      ? {
        name: editableInfo.name,
        phone: editableInfo.phone,
        email: editableInfo.email,
        gender: editableInfo.gender,
      }
      : {
        name: editableInfo.name,
        phone: editableInfo.phone,
        email: editableInfo.email,
        gender: editableInfo.gender,
        // job: editableInfo.job,
        // department: editableInfo.department,
        // organization: editableInfo.organization,
        // employmentDate: editableInfo.employmentDate,
      };

  const labels = Object.keys(filteredInfo).map((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      return el.replace(uppercaseLetter, ` ${uppercaseLetter.toLowerCase()}`);
    }
    return el;
  });
  const renderItems = labels.map((label, key) => (
    <SoftBox key={label} display="flex" flexDirection="column" py={1} pr={2}>
      <SoftTypography variant="button" fontWeight="bold" textTransform="capitalize">
        {label}: &nbsp;
      </SoftTypography>
      {isEditMode ? (
        Object.keys(filteredInfo)[key] === "gender" ? (
          <FormControl fullWidth variant="outlined">
            <Select
              name="gender"
              value={editableInfo.gender}
              onChange={handleInputChange}
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
            {errors.gender && <FormHelperText error>{errors.gender}</FormHelperText>}
          </FormControl>
        ) : (
          <TextField
            name={Object.keys(filteredInfo)[key]}
            value={Object.values(filteredInfo)[key]}
            onChange={handleInputChange}
            size="small"
            fullWidth
            variant="outlined"
            error={!!errors[Object.keys(filteredInfo)[key]]}
            helperText={errors[Object.keys(filteredInfo)[key]]}
          />
        )
      ) : (
        <SoftTypography variant="button" fontWeight="regular" color="text">
          &nbsp;{Object.values(filteredInfo)[key]}
        </SoftTypography>
      )}
    </SoftBox>
  ));


  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
        <Tooltip title={action.tooltip} placement="top">
          <Icon onClick={handleEditClick} style={{ cursor: "pointer" }}>
            {isEditMode ? "save" : "edit"}
          </Icon>
        </Tooltip>
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox mb={2} lineHeight={1} sx={{ width: "100%" }}>
          {isEditMode ? (
            <SoftBox sx={{ width: "100%" }}>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={editableDescription}
                onChange={handleDescriptionChange}
                placeholder="Add a description"
                variant="outlined"
                sx={{
                  width: "100%",
                  overflow: "auto", // Ensure overflow handling
                  whiteSpace: "pre-wrap", // Ensure text wraps
                  wordBreak: "break-word", // Ensure long words break
                }}
              />
            </SoftBox>
          ) : (
            <SoftTypography variant="button" color="text" fontWeight="regular">
              {editableDescription || (
                <Button variant="outlined" onClick={() => setIsEditMode(true)}>
                  Add Description
                </Button>
              )}
            </SoftTypography>
          )}
        </SoftBox>
        <SoftBox opacity={0.3}>
          <Divider />
        </SoftBox>
        <SoftBox>{renderItems}</SoftBox>
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
    </Card>
  );
}

CustomProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  info: PropTypes.objectOf(PropTypes.string).isRequired,
  action: PropTypes.shape({
    route: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CustomProfileInfoCard;
