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
  collaborator,
  onEditCollaborator,
  onUpdate,
}) => {


  const [currentCollaborator, setCurrentCollaborator] = useState(collaborator);
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInterns, setIsEditingInterns] = useState(false);
  const [isEditingCollaborator, setIsEditingCollaborator] = useState(false);

  const [internsMap, setInternsMap] = useState({});

  const [selectedInternIds, setSelectedInternIds] = useState([]);
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState(collaborator?.id || "");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const updateGroup = useGroupStore((state) => state.updateGroup);
  const fetchGroupsByDepartment = useGroupStore((state) => state.fetchGroupsByDepartment);
  const [departmentGroups, setDepartmentGroups] = useState([]);
  const [remainingInterns, setRemainingInterns] = useState([]);
  const { stagiaires, loadInterns, getStagiaireById } = useInternStore();
  const { loadCollaborators } = useCollaboratorStore((state) => ({

    loadCollaborators: state.getCollaborators,

  }));
  useEffect(() => {
    loadCollaborators();
  }, [loadCollaborators, isEditingCollaborator]);

  useEffect(() => {
    if (collaborator) {
      setCurrentCollaborator({ id: collaborator.id, name: collaborator.name, })

      setSelectedCollaboratorId(collaborator.id);
    }
  }, [collaborator]);

  useEffect(() => {
    loadInterns()
  }, [loadInterns, isEditingInterns]);
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groups = await fetchGroupsByDepartment(department);
        setDepartmentGroups(groups || []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };


    if (department) {
      fetchGroups()
    };
  }, [department, fetchGroupsByDepartment, stagiaires]);
  useEffect(() => {
    if (departmentGroups)
      setRemainingInterns(getActiveInterns(department))
  }, [departmentGroups, stagiaires])
  useEffect(() => {
    const loadInternNames = async () => {
      try {
        const internNames = await Promise.all(
          selectedInterns.map(async (internId) => {
            const intern = await getStagiaireById(internId);

            return {
              id: internId,
              name: intern?.name || "Unknown Intern"
            };
          })
        );

        const internsObject = internNames.reduce((acc, intern) => {
          acc[intern.id] = intern.name;
          return acc;
        }, {});
        setInternsMap(internsObject);
      } catch (error) {
        console.error("Failed to fetch intern names:", error);
      }
    };
    loadInternNames();
  }, [selectedInterns, getStagiaireById]);

  const getActiveInterns = (department) => {
    const today = new Date().toISOString().split("T")[0];
    const activeInternIds = new Set();

    departmentGroups.forEach((group) => {
      const expirationDate = group?.expirationDate;
      if (expirationDate && new Date(expirationDate) > new Date(today)) {
        group.periods.forEach(period => {
          if (period.internId) {
            activeInternIds.add(period.internId);
          }
        });
      }
    });
    console.log(activeInternIds, stagiaires)
    return stagiaires.filter((stagiaire) =>
      stagiaire.department === department && !activeInternIds.has(stagiaire.id)
    );
  };



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
    setSelectedInternIds((prevSelectedInternIds) => {

      const isSelected = prevSelectedInternIds.includes(internId);


      if (isSelected) {
        return prevSelectedInternIds.filter((id) => id !== internId);
      }


      return [...prevSelectedInternIds, internId];
    });
  };
  const handleSubmit = () => {

    const selectedInternsToAdd = remainingInterns.filter((intern) =>
      selectedInternIds.includes(intern.id)
    );


    const selectedInternIdsToAdd = selectedInternsToAdd.map((intern) => intern.id);


    const updatedSelectedInternIds = [
      ...selectedInterns.filter((internId) => !selectedInternIds.includes(internId)),
      ...selectedInternIdsToAdd,
    ];
    setIsEditingInterns(true);

    setConfirmationModalTitle("Confirm Save");
    setConfirmationModalDescription("Are you sure you want to save the changes?");
    setOnConfirmAction(() => () => {
      const updatedGroup = {
        ...group,
        newInternIds: updatedSelectedInternIds.length > 0 ? updatedSelectedInternIds : selectedInterns
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
          collaboratorId: selectedCollaboratorId,
          newInternIds: selectedInterns,

        };
        console.log(updatedGroup)
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
    setActionType("delete");
    setConfirmationModalTitle("Confirm Delete");
    setConfirmationModalDescription("Are you sure you want to delete this intern?");
    setOnConfirmAction(() => async () => {
      setIsEditingInterns(true);
      await removeInternFromGroup(groupId, internId);

      onUpdate();
      toast.success("Intern deleted successfully!");
      setIsEditingInterns(false);
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
              {selectedInterns.map((internId) => (
                <Card key={internId} sx={{ borderRadius: 2, width: "200px", px: 2, py: 1 }}>
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
                      primary={internsMap[internId] || "Unknown Intern"}
                      primaryTypographyProps={{ fontSize: "0.75rem", color: "#3a416f" }}
                      sx={{ pl: "12px" }}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Remove Intern">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveIntern(group.id, internId)}
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
                    selectedCollaboratorId,
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