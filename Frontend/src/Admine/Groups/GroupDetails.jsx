import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGroupStore from "store/GroupsStore";
import useCollaboratorStore from "store/collaboratorStore";
import useInternStore from "store/InternStore";
import {
  Grid,
  Card,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  TextField,
  Button,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Edit, Save, Add, Info, Delete } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import PersonIcon from "@mui/icons-material/Person";
import curved0 from "assets/images/curved-images/curved0.jpg";
import ConfirmationModal from "components/ConfirmationModals";
import toast from "react-hot-toast";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const getGroupById = useGroupStore((state) => state.getGroupById);
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const [group, setGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingInterns, setIsEditingInterns] = useState(false);
  const [isEditingCollaborator, setIsEditingCollaborator] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const groups = useGroupStore((state) => state.groups);
  const stagiaires = useInternStore((state) => state.stagiaires);

  const getActiveInterns = (department) => {
    const today = new Date().toISOString().split("T")[0];
    const activeInterns =
      groups[department]
        ?.flatMap((group) =>
          new Date(group.expirationDate) > new Date(today) ? group.stagiaires : []
        )
        .map((intern) => intern.id) || [];

    return stagiaires.filter(
      (stagiaire) =>
        stagiaire.internshipInfo.department === department && !activeInterns.includes(stagiaire.id)
    );
  };
  const filteredStagiaires = selectedDepartment ? getActiveInterns(selectedDepartment) : [];
  const filteredCollaborators = selectedDepartment
    ? collaborators.filter((collaborator) => collaborator.department === selectedDepartment)
    : [];

  useEffect(() => {
    const fetchedGroup = getGroupById(id);
    if (fetchedGroup) {
      setGroup(fetchedGroup);
      setGroupName(fetchedGroup.name);
      setDescription(fetchedGroup.description);
      setExpirationDate(fetchedGroup.expirationDate);
      setSelectedInterns(fetchedGroup.stagiaires);
      setSelectedDepartment(fetchedGroup.department);
      setSelectedCollaborator(fetchedGroup.collaborator);
      setSubjects([
        { name: "Project A", type: "Project" },
        { name: "Training B", type: "Training" },
      ]);
    }
  }, [id, getGroupById]);

  const handleSave = () => {
    console.log("Saving changes...");
    setConfirmationModalTitle("Confirm Save");
    setConfirmationModalDescription("Are you sure you want to save the changes?");
    setOnConfirmAction(() => () => {
      const updatedGroup = {
        ...group,
        name: groupName,
        description,
        expirationDate,
        stagiaires: selectedInterns,
        department: selectedDepartment,
        collaborator: selectedCollaborator,
        subjects,
      };
      console.log("Updated group:", updatedGroup);
      useGroupStore.getState().updateGroup(id, updatedGroup);
      console.log("Group updated in store");
      setGroup(updatedGroup);
      setIsEditing(false);
      setIsEditingInterns(false);
      setIsEditingCollaborator(false);
      toast.success("Group updated successfully!");
    });
    setIsConfirmationModalOpen(true);
  };

  const handleSelectIntern = (intern) => {
    setSelectedInterns((prev) => {
      if (prev.includes(intern)) {
        return prev.filter((i) => i !== intern);
      } else {
        return [...prev, intern];
      }
    });
  };

  const getCollaboratorNameById = (id) => {
    const collaborator = collaborators.find((collaborator) => collaborator.id === id);
    return collaborator ? collaborator.name : "Unknown Collaborator";
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box mt={5} mb={3} px={3}>
        <Card
          sx={{
            backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
              `${linearGradient(
                rgba(gradients.info.main, 0.6),
                rgba(gradients.info.state, 0.6)
              )}, url(${curved0})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
            p: 3,
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Avatar
            sx={{ width: 120, height: 120, bgcolor: "#dfe3ee", mb: 2, mx: "auto" }}
            alt={groupName}
          >
            <Typography variant="h3" fontWeight="bold" color="#4267B2">
              {groupName[0]}
            </Typography>
          </Avatar>
          <Typography variant="h4" fontWeight="bold">
            {groupName}
          </Typography>
          <Typography variant="body1" mt={1}>
            {description}
          </Typography>
          <Typography variant="body2" mt={1}>
            Expires on: {expirationDate}
          </Typography>
        </Card>

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: "#f9f9f9",
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
                <Typography variant="h6" fontWeight="bold">
                  Group Information:
                </Typography>
                <IconButton
                  color="info"
                  onClick={() => {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? <Save /> : <Edit />}
                </IconButton>
              </Box>
              <Box p={2}>
                {isEditing ? (
                  <>
                    <Box mb={2}> {/* Margin bottom */}
                      <TextField
                        fullWidth
                        label="Name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        margin="normal"
                        variant="outlined"
                      />
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                      />
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <TextField
                        fullWidth
                        label="Expiration Date"
                        type="date"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <FormControl fullWidth variant="outlined">
                        <InputLabel>Department</InputLabel>
                        <Select
                          value={selectedDepartment}
                          onChange={(e) => setSelectedDepartment(e.target.value)}
                          label="Department"
                        >
                          <MenuItem value="Microsoft&Data">Microsoft & Data</MenuItem>
                          <MenuItem value="Front&Mobile">Front & Mobile</MenuItem>
                          <MenuItem value="Java">Java</MenuItem>
                          <MenuItem value="PHP">PHP</MenuItem>
                          <MenuItem value="DevOps">DevOps</MenuItem>
                          <MenuItem value="Test&Support">Test & Support</MenuItem>
                        </Select>
                      </FormControl>

                    </Box>
                  </>
                ) : (
                  <>
                    <Box mb={2}> {/* Margin bottom */}
                      <Typography variant="body2" gutterBottom>
                        <strong>Name:</strong> {groupName}
                      </Typography>
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <Typography variant="body2" gutterBottom>
                        <strong>Description:</strong> {description}
                      </Typography>
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <Typography variant="body2" gutterBottom>
                        <strong>Expiration Date:</strong> {expirationDate}
                      </Typography>
                    </Box>
                    <Box mb={2}> {/* Margin bottom */}
                      <Typography variant="body2" gutterBottom>
                        <strong>Department:</strong> {selectedDepartment}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                bgcolor: "#f9f9f9",
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" >
                  Subjects:
                </Typography>
                <IconButton
                  color="info"
                  onClick={() => navigate(`/create-subject/${id}`)}
                  sx={{
                    bgcolor: '#e1f5fe',
                    '&:hover': { bgcolor: '#b3e5fc' },
                    borderRadius: '50%',
                    p: 1,
                    boxShadow: 2,
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
              <List sx={{ maxHeight: 400, overflowY: 'auto', p: 0 }}>
                {subjects.map((subject, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': { borderBottom: 'none' },

                      borderRadius: 2,
                      mb: 1,
                      '&:hover': { bgcolor: '#e3f2fd', cursor: 'pointer' },
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: subject.color || '#c5cae9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {subject.name[0]}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={subject.name}
                      secondary={subject.type}
                      primaryTypographyProps={{ fontWeight: 'bold', color: '#333' }}
                      secondaryTypographyProps={{ color: '#666' }}
                      sx={{ flex: 1 }}
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="More Details">
                        <IconButton
                          edge="end"
                          aria-label="details"
                          color="info"
                          onClick={() => navigate(`/subject-details/${id}`)}
                          sx={{
                            color: '#0288d1',
                            '&:hover': { bgcolor: '#e3f2fd' },
                            borderRadius: '50%',
                          }}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton

                          aria-label="delete"
                          color="error"
                          onClick={() => {/* handle delete subject */ }}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': { bgcolor: '#ffebee' },
                            borderRadius: '50%',
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>




          <Grid item xs={12} md={12}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: "#f9f9f9",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
              }}
            >
              {/* Interns Section */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Interns:
                  </Typography>
                  <IconButton
                    color="info"
                    onClick={() => {
                      if (isEditingInterns) {
                        handleSave();
                      } else {
                        setIsEditingInterns(true);
                      }
                    }}
                  >
                    {isEditingInterns ? <Save /> : <Edit />}
                  </IconButton>
                </Box>
                <List>
                  {selectedInterns.map((intern) => (
                    <ListItem key={intern.id} sx={{ pl: 0 }}>
                      <ListItemText primary={intern.name} />
                      {isEditingInterns && (
                        <ListItemSecondaryAction>
                          <Tooltip title="Remove Intern">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleSelectIntern(intern)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  ))}
                  {isEditingInterns && (
                    <>
                      <Typography variant="body2" gutterBottom>
                        Add Interns:
                      </Typography>
                      {filteredStagiaires.map((intern) => (
                        <ListItem
                          key={intern.id}
                          button
                          onClick={() => handleSelectIntern(intern)}
                          selected={selectedInterns.includes(intern)}
                        >
                          <ListItemText primary={intern.name} />
                        </ListItem>
                      ))}
                    </>
                  )}
                </List>
              </Box>

              {/* Collaborator Section */}
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Collaborator:
                  </Typography>
                  <IconButton
                    color="info"
                    onClick={() => {
                      if (isEditingCollaborator) {
                        handleSave();
                      } else {
                        setIsEditingCollaborator(true);
                      }
                    }}
                  >
                    {isEditingCollaborator ? <Save /> : <Edit />}
                  </IconButton>
                </Box>
                {isEditingCollaborator ? (
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Collaborator</InputLabel>
                    <Select
                      value={selectedCollaborator}
                      onChange={(e) => setSelectedCollaborator(e.target.value)}
                      label="Collaborator"
                    >
                      {filteredCollaborators.map((collaborator) => (
                        <MenuItem key={collaborator.id} value={collaborator.id}>
                          {collaborator.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body2" gutterBottom>
                    <strong>Collaborator:</strong> {getCollaboratorNameById(selectedCollaborator)}
                  </Typography>
                )}
              </Box>
            </Card>
          </Grid>

        </Grid>
      </Box>
      <Footer />
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
    </DashboardLayout>
  );
};

export default GroupDetails;
