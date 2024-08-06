import React, { useEffect, useState } from "react";
import {
  Card,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Tooltip,
  InputAdornment,
  Divider,
} from "@mui/material";
import { ClearOutlined, Save, Person, Edit } from "@mui/icons-material";
import StyledIcon from "components/StyledIcon";
import PropTypes from "prop-types";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import useGroupStore from "store/GroupsStore";
import ConfirmationModal from "components/ConfirmationModals";
import toast from "react-hot-toast";
import useCollaboratorStore from "store/collaboratorStore";
import useInternStore from "store/InternStore";
import { useParams } from "react-router-dom";

const CircleIcon = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  backgroundColor: theme.palette.grey[200],
}));

const CollaboratorsInternsCard = ({
  group,
  department,
  selectedInterns,
  onAddInterns,
  collaborator,
  onEditCollaborator,
  onUpdate,
}) => {
  console.log(collaborator)
  const [currentCollaborator, setCurrentCollaborator] = useState(collaborator);
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  // const [selectedInterns, setSelectedInterns] = useState([]);
  // const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const stagiaires = useInternStore((state) => state.stagiaires);
  

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInterns, setIsEditingInterns] = useState(false);
  const [isEditingCollaborator, setIsEditingCollaborator] = useState(false);

  const [selectedInternIds, setSelectedInternIds] = useState([]);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState(collaborator?.id || "");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});
  const updateGroup = useGroupStore((state) => state.updateGroup);
  const getGroupsByDepartment = useGroupStore((state) => state.getGroupsByDepartment);

  const getCollaboratorNameById = (id) => {
    const collaborator = collaborators.find((collaborator) => collaborator.id === id);
    return collaborator ? collaborator.name : "Unknown Collaborator";
  };

  useEffect(() => {
    if (collaborator) {
      setCurrentCollaborator({id: collaborator, name: getCollaboratorNameById(collaborator)})
      console.log(currentCollaborator)
      setSelectedCollaboratorId(collaborator.id);
    }
  }, [collaborator]);

  const getActiveInterns = (department) => {
    const today = new Date().toISOString().split("T")[0];
    const activeInterns =
      getGroupsByDepartment(department)
        ?.flatMap((group) =>
          new Date(group.expirationDate) > new Date(today) ? group.stagiaires : []
        )
        .map((intern) => intern.id) || [];

    return stagiaires.filter(
      (stagiaire) =>
        stagiaire.internshipInfo.department === department && !activeInterns.includes(stagiaire.id)
    );
  };
  // const handleEditCollaborator = (collaborator) => {
  //   setSelectedCollaborator(collaborator);
  // };

  const remainingInterns = department ? getActiveInterns(department) : [];
  const remainingCollaborators = department
    ? collaborators.filter((collab) => collab.department === department)
    : [];

  const removeInternFromGroup = useGroupStore((state) => state.removeInternFromGroup);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (internId) => {
    setSelectedInternIds((prevSelectedInternIds) =>
      prevSelectedInternIds.includes(internId)
        ? prevSelectedInternIds.filter((id) => id !== internId)
        : [...prevSelectedInternIds, internId]
    );
  };

  const handleSubmit = () => {
    const selectedInternsToAdd = remainingInterns.filter((intern) =>
      selectedInternIds.includes(intern.id)
    );
    const updatedSelectedInterns = [
      ...selectedInterns.filter((intern) => !selectedInternIds.includes(intern.id)),
      ...selectedInternsToAdd,
    ];

    setConfirmationModalTitle("Confirm Save");
    setConfirmationModalDescription("Are you sure you want to save the changes?");
    setOnConfirmAction(() => () => {
      const updatedGroup = {
        ...group,
        stagiaires: updatedSelectedInterns,
      };
      updateGroup(group.id, updatedGroup);
      onUpdate();
      setIsEditing(false);
      setIsEditingInterns(false);
      setIsEditingCollaborator(false);
      toast.success("Group updated successfully!");
    });
    setIsConfirmationModalOpen(true);
    setSelectedInternIds([]);
    handleClose();
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);

    if (isEditing) {
      const selectedCollaborator = remainingCollaborators.find(
        (collab) => collab.id === selectedCollaboratorId
      );
      setConfirmationModalTitle("Confirm Save");
      setConfirmationModalDescription("Are you sure you want to save the changes?");
      setOnConfirmAction(() => () => {
        const updatedGroup = {
          ...group,
          collaborator: selectedCollaborator, // Ensure this is correct
        };
        updateGroup(group.id, updatedGroup);
        onEditCollaborator(selectedCollaborator);
        onUpdate();
        setIsEditing(false);
        setIsEditingInterns(false);
        setIsEditingCollaborator(false);
        toast.success("Group updated successfully!");
      });
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCollaboratorChange = (event) => {
    setSelectedCollaboratorId(event.target.value);
  };

  const renderEditableSelectField = (label, value, key, options) => (
    <SoftBox key={key} display="flex" py={1} pr={2}>
      <FormControl fullWidth variant="outlined">
        <Select
          startAdornment={
            <InputAdornment position="start">
              <StyledIcon>
                <Person />
              </StyledIcon>
            </InputAdornment>
          }
          name={key}
          value={value || ""}
          onChange={handleCollaboratorChange}
          displayEmpty
          variant="outlined"
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#CCCCCC" }}>{label}</span>;
            }
            const selectedOption = options.find((option) => option.id === selected);
            return selectedOption ? selectedOption.name : selected;
          }}
        >
          <MenuItem value="" disabled>
            {label}
          </MenuItem>
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </SoftBox>
  );

  const handleRemoveIntern = (groupId, internId) => {
    setActionType("delete")
    setConfirmationModalTitle("Confirm Delete");
    setConfirmationModalDescription("Are you sure you want to delete this intern?");
    setOnConfirmAction(() => () => {
      removeInternFromGroup(groupId, internId);
      onUpdate(); // Call to trigger a re-render or additional logic
      toast.success("Intern deleted successfully!");
    });
    setIsConfirmationModalOpen(true);
  };


  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      {/* Interns Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <Box mb={0.5}>
            <Typography variant="h6" fontWeight="medium">
              Interns
            </Typography>
          </Box>
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add Intern
          </Button>
        </Box>
        <Box px={2} pb={2}>
          {selectedInterns.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 1 }}>
            No interns available. Please add interns.
          </Typography>
          ) : (
          <List sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 2, py: 2 }}>
            {selectedInterns.map((intern) => (
              <Card key={intern.id} sx={{ borderRadius: 2, width: "200px", px: 2, py: 1 }}>
                <ListItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "no-wrap",
                  }}
                >
                  <CircleIcon>
                    <StyledIcon>
                      <Person />
                    </StyledIcon>
                  </CircleIcon>

                  <ListItemText
                    primary={intern.name}
                    primaryTypographyProps={{ fontSize: "0.75rem", color: "#3a416f" }}
                    sx={{ pl: "12px" }}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Remove Intern">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveIntern(group.id, intern.id)}
                      >
                        <StyledIcon>
                          <ClearOutlined />
                        </StyledIcon>
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Card>
            ))}
          </List>
          )}
        </Box>
      </Box>

      {/* Collaborator Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
          <Box mb={0.5}>
            <Typography variant="h6" fontWeight="medium">
              Collaborator
            </Typography>
          </Box>
          <IconButton onClick={handleEditToggle} color="primary">
            <StyledIcon>{isEditing ? <Save /> : <Edit />}</StyledIcon>
          </IconButton>
        </Box>
        <Box px={2} pb={2}>
          {isEditing ? (
            <Box>
              <SoftBox display="flex" flexDirection="column" py={1} pr={2}>
                <SoftTypography
                  variant="body2"
                  textTransform="capitalize"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Select Collaborator:
                </SoftTypography>
                {remainingCollaborators.length > 0 ? (
                  renderEditableSelectField(
                    "Collaborator",
                    collaborator.name,
                    "collaborator",
                    remainingCollaborators
                  )
                ) : (
                  <SoftTypography variant="body2" color="textSecondary">
                    No remaining collaborators available.
                  </SoftTypography>
                )}
              </SoftBox>
            </Box>
          ) : (
            collaborator && (
              <Card sx={{ borderRadius: 2, mb: 2, width: "100%" }}>
                <ListItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                  }}
                >
                  <CircleIcon>
                    <StyledIcon>
                      <Person />
                    </StyledIcon>
                  </CircleIcon>

                  <ListItemText
                    primary={currentCollaborator.name}
                    primaryTypographyProps={{ fontSize: "0.75rem", color: "#3a416f" }}
                    sx={{ pl: "12px" }}
                  />
                </ListItem>
              </Card>
            )
          )}
        </Box>
      </Box>

      {/* Modal for adding interns */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle variant="h6" textTransform="uppercase">
          Remaining interns in this department
        </DialogTitle>
        <Divider sx={{ my: 0, py: 0 }} />
        <DialogContent>
          {remainingInterns.length === 0 ? (
            <Box>
              <Typography variant="body2" color="textSecondary">
                No remaining interns available.
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Interns
              </Typography>
              <List>
                {remainingInterns.map((intern) => (
                  <ListItem
                    key={intern.id}
                    button
                    onClick={() => handleToggle(intern.id)}
                    sx={{
                      padding: 0, // Remove default padding to ensure checkbox gets space
                      "&:hover": {
                        backgroundColor: "transparent", // Remove the background color on hover
                      },
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedInternIds.includes(intern.id)}
                          onChange={() => handleToggle(intern.id)}
                        />
                      }
                      label={intern.name}
                      sx={{ width: "100%" }} // Ensure checkbox and label take full width
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={selectedInternIds.length === 0}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
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
};

CollaboratorsInternsCard.propTypes = {
  group: PropTypes.object.isRequired,
  department: PropTypes.string.isRequired,
  selectedInterns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  // remainingInterns: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     name: PropTypes.string.isRequired,
  //   })
  // ).isRequired,
  onAddInterns: PropTypes.func.isRequired,
  collaborator: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  // remainingCollaborators: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     name: PropTypes.string.isRequired,
  //   })
  // ).isRequired,
  onEditCollaborator: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  // setGroup: PropTypes.func.isRequired,
};

export default CollaboratorsInternsCard;
