import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  Icon,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CalendarToday from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import StyledIcon from "components/StyledIcon";
import ConfirmationModal from "components/ConfirmationModals";
import useGroupStore from "store/GroupsStore";
import toast from "react-hot-toast";

const InfoGroupCard = ({
  group,
  groupName,
  description,
  expirationDate,
  department,
  // isEditing,
  onUpdate,
  onEditToggle,
  setGroup,
}) => {
  const [editableInfo, setEditableInfo] = useState({
    name: "",
    description: "",
    expirationDate: "",
    department: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const updateGroup = useGroupStore((state) => state.updateGroup)

  useEffect(() => {
    setEditableInfo({
      name: groupName,
      description: description,
      expirationDate: expirationDate,
      department: department,
    });
  }, [groupName, description, expirationDate, department]);


  // const handleSave = () => {
  //   onSave(editableInfo);
  //   onUpdate
  // };

  const handleSave = () => {

    setConfirmationModalTitle("Confirm Save");
    setConfirmationModalDescription("Are you sure you want to save the changes?");
    setOnConfirmAction(() => () => {
      const newInternsIds = group.periods.map(period => period.internId).filter(id => id);
      const updatedGroup = {
        ...group,
        name: editableInfo.name,
        description: editableInfo.description,
        expirationDate: editableInfo.expirationDate,
        department: editableInfo.department,
        newInternIds: newInternsIds,
      };
      console.log("Updated Group Data:", updatedGroup);
      updateGroup(group.id, updatedGroup);
      onUpdate();
      setGroup(updatedGroup);
      setIsEditing(false);
      // setIsEditingInterns(false);
      // setIsEditingCollaborator(false);
      toast.success("Group updated successfully!");


    });

    setIsConfirmationModalOpen(true);
  };



  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
      setIsEditing(false)
    } else {
      setIsEditing(true);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleDateChange = (date) => {
    setEditableInfo((prevInfo) => ({ ...prevInfo, expirationDate: date.format("YYYY-MM-DD") }));
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
          onChange={handleDateChange}
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
    return (
      <>
        <SoftBox p={2}>
          {isEditing
            ? renderEditableField("Name", editableInfo.name, "name")
            : renderField("Name", editableInfo.name, "name")}
          {isEditing
            ? renderEditableField("Description", editableInfo.description, "description")
            : renderField("Description", editableInfo.description, "description")}
          {isEditing
            ? renderEditableSelectField("Department", editableInfo.department, "department", [
              { value: "Microsoft&Data", label: "Microsoft & Data" },
              { value: "Front&Mobile", label: "Front & Mobile" },
              { value: "Java", label: "Java" },
              { value: "PHP", label: "PHP" },
              { value: "Devops", label: "Devops" },
              { value: "Test&Support", label: "Test & Support" },
            ])
            : renderField("Department", editableInfo.department, "department")}
          {isEditing
            ? renderEditableDateField(
              "Expiration Date",
              editableInfo.expirationDate,
              "expirationDate"
            )
            : renderField("Expiration Date", editableInfo.expirationDate, "expirationDate")}
        </SoftBox>
      </>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ height: "100%" }}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <SoftBox mb={0.5}>
            <SoftTypography variant="h6" fontWeight="medium">
              Group Information
            </SoftTypography>
          </SoftBox>
          <Tooltip title={isEditing ? "Save" : "Edit"} placement="top">
            <IconButton onClick={() => handleEditToggle()} color="info">
              <Icon>{isEditing ? "save" : "edit"}</Icon>
            </IconButton>
          </Tooltip>
        </SoftBox>
        <SoftBox px={2} pb={2}>
          <SoftBox mt={2}>{renderItems()}</SoftBox>
        </SoftBox>
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
    </LocalizationProvider>
  );
};


// PropTypes validation
InfoGroupCard.propTypes = {
  group: PropTypes.object.isRequired,
  groupName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  expirationDate: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onEditToggle: PropTypes.func.isRequired,
  setGroup: PropTypes.func.isRequired,
};

export default InfoGroupCard;
