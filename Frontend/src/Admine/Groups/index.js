import React, { useState, useEffect } from "react";
import useInternStore from "store/InternStore";
import GroupFilter from "./GroupFilter";
import SoftBox from "components/SoftBox";
import useCollaboratorStore from "store/collaboratorStore";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import CollaboratorSelector from "Admine/collaborator/CollaboratorSelector";
import Icon from "@mui/material/Icon";
import SoftPagination from "components/SoftPagination";
import ConfirmationModal from "components/ConfirmationModals";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  IconButton,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import useGroupStore from "store/GroupsStore";

const Groups = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const stagiaires = useInternStore((state) => state.stagiaires);
  const groups = useGroupStore((state) => state.groups);
  const addGroup = useGroupStore((state) => state.addGroup);
  const deleteGroup = useGroupStore((state) => state.deleteGroup);
  const collaborators = useCollaboratorStore((state) => state.collaborators);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});
  const departments = [
    { value: "Microsoft&Data", label: "Microsoft & Data" },
    { value: "Front&Mobile", label: "Front & Mobile" },
    { value: "Java", label: "Java" },
    { value: "PHP", label: "PHP" },
    { value: "Devops", label: "Devops" },
    { value: "Test&Support", label: "Test & Support" },
  ];
  const getActiveInterns = (department) => {
    const today = new Date().toISOString().split("T")[0]; // Date actuelle au format YYYY-MM-DD
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
  // Filtrer les stagiaires en fonction du département sélectionné
  const filteredStagiaires = selectedDepartment ? getActiveInterns(selectedDepartment) : [];
  const filteredCollaborators = selectedDepartment
    ? collaborators.filter((collaborator) => collaborator.department === selectedDepartment)
    : [];
  // Réinitialiser la liste des stagiaires sélectionnés lorsque le département change
  useEffect(() => {
    setSelectedInterns([]);
    setGroupName("");
    setDescription("");
    setExpirationDate("");
    setSelectedCollaborator("");
    setShowCreateGroupForm(false);
  }, [selectedDepartment]);

  const handleSelectIntern = (intern) => {
    setSelectedInterns((prev) =>
      prev.includes(intern) ? prev.filter((i) => i.id !== intern.id) : [...prev, intern]
    );
  };
  const navigate = useNavigate();
  const handleCreateGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: groupName,
      description,
      expirationDate,
      stagiaires: selectedInterns || [],
      department: selectedDepartment,
      collaborator: selectedCollaborator,
    };

    console.log("Creating new group:", newGroup);

    // Rediriger vers la page de création de sujet si la case est cochée
    if (addSubject) {
      addGroup(selectedDepartment, newGroup);

      navigate(`/create-subject/${newGroup.id}`);
    } else {
      // Afficher la confirmation
      setActionType("success");
      setConfirmationModalTitle("Add Subject");
      setConfirmationModalDescription(
        "Are you sure you don't want to add a subject for this group?"
      );
      setOnConfirmAction(() => () => {
        addGroup(selectedDepartment, newGroup);

        setShowCreateGroupForm(false);
        setSelectedInterns([]);
        setGroupName("");
        setDescription("");
        setExpirationDate("");
        setSelectedCollaborator("");
      });
    }

    setIsConfirmationModalOpen(true);
  };

  const departmentGroups = groups[selectedDepartment] || [];

  const handleDelete = (id) => {
    setActionType("delete");
    setConfirmationModalTitle("Delete Group");
    setConfirmationModalDescription(
      "Are you sure you want to delete this group? This action cannot be undone."
    );
    setOnConfirmAction(() => () => {
      deleteGroup(id);
      toast.success("Group deleted successfully!");
    });
    setIsConfirmationModalOpen(true);
  };
  const handleViewDetails = (id) => {
    navigate(`/groupdetails/${id}`);
  };
  //Groups Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of groups per page
  const indexOfLastGroup = currentPage * itemsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - itemsPerPage;
  const currentGroups = departmentGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const [currentGroup, setCurrentGroup] = useState(0);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(departmentGroups.length / itemsPerPage);
  const buttonsPerPage = 5; // Nombre de boutons de pages affichés simultanément
  const renderPageButtons = () => {
    const start = currentGroups * buttonsPerPage;
    const end = Math.min(start + buttonsPerPage, totalPages);
    const pageButtons = [];

    for (let i = start; i < end; i++) {
      pageButtons.push(
        <Button
          key={i + 1}
          variant={i + 1 === currentPage ? "contained" : "outlined"}
          onClick={() => handlePageChange(i + 1)}
          sx={{
            mx: 0.5,
            px: 2,
            borderRadius: "50%",
            backgroundColor: i + 1 === currentPage ? "#4caf50" : "#ffffff",
            color: i + 1 === currentPage ? "#ffffff" : "#333",
            border: `1px solid ${i + 1 === currentPage ? "#4caf50" : "#e0e0e0"}`,
            "&:hover": {
              backgroundColor: i + 1 === currentPage ? "#388e3c" : "#f0f0f0",
            },
          }}
        >
          {i + 1}
        </Button>
      );
    }

    return pageButtons;
  };
  //interns pagination

  const [currentPageintern, setCurrentPageintern] = useState(1);
  const itemsPerPageintern = 20; // Number of groups per page
  const indexOfLastintern = currentPageintern * itemsPerPageintern;
  const indexOfFirstintern = indexOfLastintern - itemsPerPageintern;
  const currentInterns = filteredStagiaires.slice(indexOfFirstintern, indexOfLastintern);
  const [currentIntern, setCurrentIntern] = useState(0);
  const handlePageChangeintern = (pageNumber) => {
    setCurrentPageintern(pageNumber);
  };
  const totalPagesintern = Math.ceil(filteredStagiaires.length / itemsPerPageintern);
  const buttonsPerPageintern = 5; // Nombre de boutons de pages affichés simultanément
  const renderPageButtonsintern = () => {
    const start = currentInterns * buttonsPerPageintern;
    const end = Math.min(start + buttonsPerPageintern, totalPagesintern);
    const pageButtons = [];

    for (let i = start; i < end; i++) {
      pageButtons.push(
        <Button
          key={i + 1}
          variant={i + 1 === currentPageintern ? "contained" : "outlined"}
          onClick={() => handlePageChangeintern(i + 1)}
          sx={{
            mx: 0.5,
            px: 2,
            borderRadius: "50%",
            backgroundColor: i + 1 === currentPageintern ? "#4caf50" : "#ffffff",
            color: i + 1 === currentPageintern ? "#ffffff" : "#333",
            border: `1px solid ${i + 1 === currentPageintern ? "#4caf50" : "#e0e0e0"}`,
            "&:hover": {
              backgroundColor: i + 1 === currentPageintern ? "#388e3c" : "#f0f0f0",
            },
          }}
        >
          {i + 1}
        </Button>
      );
    }

    return pageButtons;
  };
  const [addSubject, setAddSubject] = useState(false); // État pour la case à cocher

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4}>
        <GroupFilter
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          departments={departments}
        />
        <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2} alignItems="stretch">
          <Box
            flex={1}
            border={1}
            borderColor="divider"
            borderRadius={2}
            p={2}
            m={1}
            display="flex"
            flexDirection="column"
            sx={{ minHeight: 400 }} // Minimum height of the box
          >
            {selectedDepartment ? (
              <>
                {showCreateGroupForm ? (
                  <Box
                    sx={{
                      maxWidth: 400, // Fixed maximum width for the card
                      width: "100%", // Ensure it takes up available space within the parent container
                      overflow: "hidden", // Hide any overflow from the card
                      padding: 2, // Add some padding
                      boxShadow: 1, // Optional: add a shadow for a card-like appearance
                      borderRadius: 2, // Rounded corners
                      backgroundColor: "#ffffff", // Background color
                    }}
                  >
                    <Box mb={2}>
                      <Typography variant="h6" textAlign="center">
                        Group Details:
                      </Typography>
                    </Box>

                    {/* Display selected members as buttons */}
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between" // Space between heading and checkbox
                        alignItems="center" // Align items vertically centered
                        mb={2}
                      >
                        <Typography variant="h6" mb={1}>
                          Members:
                        </Typography>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addSubject}
                              onChange={(e) => setAddSubject(e.target.checked)}
                            />
                          }
                          label="Add a Subject"
                          sx={{ mb: 1 }} // Margin-bottom for spacing
                        />
                      </Box>

                      <Box
                        display="flex"
                        overflow="hidden"
                        sx={{
                          gap: 1,
                          maxWidth: "100%",
                          pb: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedInterns.length === 0 ? (
                          <Typography>No members selected</Typography>
                        ) : (
                          <Box
                            display="flex"
                            sx={{
                              gap: 1,
                              overflowX: "auto", // Ensure horizontal scrolling
                              maxWidth: "100%",
                              pb: 1,
                              whiteSpace: "nowrap",
                              "&::-webkit-scrollbar": {
                                // Optional: Styling for scrollbar
                                height: "8px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#888",
                                borderRadius: "4px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#555",
                              },
                            }}
                          >
                            {selectedInterns.map((intern) => (
                              <Button
                                key={intern.id}
                                variant="contained"
                                sx={{
                                  bgcolor: "#4caf50", // Green background
                                  color: "#fff",
                                  borderRadius: 20, // Fully rounded corners
                                  px: 2, // Padding for better spacing
                                  py: 1,
                                  textTransform: "none", // Prevents text from being uppercase
                                  "&:hover": {
                                    bgcolor: "#388e3c", // Darker green on hover
                                  },
                                }}
                              >
                                {intern.name.length > 10
                                  ? `${intern.name.substring(0, 10)}...`
                                  : intern.name}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      gap={2}
                      p={2}
                      borderRadius={2}
                      sx={{ backgroundColor: "#ffffff" }} // White background for fields
                    >
                      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
                        <FormControl fullWidth>
                          <FormLabel sx={{ fontSize: 14, mb: 1, color: "#666" }}>
                            Group Name
                          </FormLabel>
                          <TextField
                            id="groupName"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            variant="outlined"
                            sx={{
                              borderRadius: 1,
                              bgcolor: "#ffffff",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </FormControl>
                        {/* <FormControl fullWidth>
                          <FormLabel
                            htmlFor="expirationDate"
                            sx={{ fontSize: 14, mb: 1, color: "#666" }}
                          >
                            Expiration Date
                          </FormLabel>
                          <TextField
                            id="expirationDate"
                            type="date"
                            value={expirationDate}
                            onChange={(e) => setExpirationDate(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              borderRadius: 1,
                              bgcolor: "#ffffff",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 1,
                              },
                            }}
                          />
                        </FormControl> */}
                        <FormControl fullWidth>
                          <FormLabel
                            htmlFor="expirationDate"
                            sx={{ fontSize: 14, mb: 1, color: "#666" }}
                          >
                            Expiration Date
                          </FormLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={expirationDate ? dayjs(expirationDate) : null}
                              onChange={(date) =>
                                setExpirationDate(date ? date.format("YYYY-MM-DD") : null)
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                  sx={{
                                    borderRadius: 1,
                                    bgcolor: "#ffffff",
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Box>
                      <FormControl fullWidth>
                        <FormLabel
                          htmlFor="description"
                          sx={{ fontSize: 14, mb: 1, color: "#666" }}
                        >
                          Description
                        </FormLabel>
                        <TextField
                          id="description"
                          placeholder="Enter description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          variant="outlined"
                          multiline
                          rows={4}
                          sx={{
                            borderRadius: 1,
                            bgcolor: "#ffffff",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 1,
                            },
                          }}
                        />
                      </FormControl>

                      <FormControl fullWidth>
                        <FormLabel sx={{ fontSize: 14, color: "#666" }}>Collaborator</FormLabel>
                        <Box
                          sx={{
                            bgcolor: "#ffffff",
                          }}
                        >
                          <CollaboratorSelector
                            filteredCollaborators={filteredCollaborators}
                            selectedCollaborator={selectedCollaborator}
                            setSelectedCollaborator={setSelectedCollaborator}
                          />
                        </Box>
                      </FormControl>
                    </Box>

                    <Box
                      mt={3}
                      display="flex"
                      flexDirection={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#bdbdbd", // Gray color for Back button
                          color: "#fff",
                          borderRadius: 1,
                          px: 3,
                        }}
                        onClick={() => setShowCreateGroupForm(false)}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "info.main", // Blue color for Create Group button
                          color: "#fff",
                          borderRadius: 1,
                          px: 3,
                        }}
                        onClick={handleCreateGroup}
                        disabled={
                          !groupName ||
                          !description ||
                          !expirationDate ||
                          !selectedCollaborator ||
                          selectedInterns.length === 0
                        }
                      >
                        Create Group
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <SoftTypography variant="h6" fontWeight="medium">
                      Interns:
                    </SoftTypography>
                    <Box
                      flex={1}
                      display="flex"
                      flexDirection="column"
                      position="relative"
                      minHeight="400px"
                    >
                      {filteredStagiaires.length === 0 ? (
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                        >
                          <InfoIcon sx={{ fontSize: 50, mb: 2 }} />
                          <Typography variant="h6">
                            No interns available in this department
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          <SoftBox mt={2} display="flex" flexWrap="wrap" gap={1}>
                            {currentInterns.map((stagiaire) => (
                              <Box
                                key={stagiaire.id}
                                display="flex"
                                alignItems="center"
                                border={1}
                                borderColor="divider"
                                borderRadius={2}
                                p={0.5}
                                bgcolor={
                                  selectedInterns.includes(stagiaire) ? "lightblue" : "transparent"
                                }
                              >
                                <SoftTypography variant="caption" color="dark" sx={{ mr: 1 }}>
                                  {stagiaire.name}
                                </SoftTypography>
                                <IconButton
                                  color="info"
                                  size="small"
                                  onClick={() => handleSelectIntern(stagiaire)}
                                >
                                  <AddIcon />
                                </IconButton>
                              </Box>
                            ))}
                          </SoftBox>

                          {/* Conteneur pour les boutons flottants */}
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 5,
                              right: 3,
                              width: "100%",
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              color="info"
                              onClick={() => setShowCreateGroupForm(true)}
                              disabled={selectedInterns.length === 0}
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                backgroundColor:
                                  selectedInterns.length === 0 ? "grey.400" : "info.main",
                                "&:hover": {
                                  backgroundColor: "info.dark",
                                },
                                "&:disabled": {
                                  backgroundColor: "grey.400",
                                },
                                color: selectedInterns.length === 0 ? "inherit" : "#fff",
                              }}
                            >
                              <AddIcon
                                sx={{ color: selectedInterns.length === 0 ? "inherit" : "#fff" }}
                              />
                            </IconButton>
                          </Box>

                          {/* Pagination Container */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                            }}
                          >
                            <SoftPagination
                              variant="gradient"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <IconButton
                                onClick={() => handlePageChangeintern(currentPageintern - 1)}
                                disabled={currentPageintern === 1}
                                sx={{
                                  borderRadius: "50%",
                                  backgroundColor: "#e0e0e0",
                                  "&:hover": { backgroundColor: "#c0c0c0" },
                                }}
                              >
                                <Icon>keyboard_arrow_left</Icon>
                              </IconButton>
                              {currentIntern > 0 && (
                                <Button onClick={() => setCurrentIntern(currentIntern - 1)}>
                                  ...
                                </Button>
                              )}

                              {renderPageButtonsintern()}

                              {totalPagesintern > (currentIntern + 1) * buttonsPerPageintern && (
                                <Button onClick={() => setCurrentIntern(currentIntern + 1)}>
                                  ...
                                </Button>
                              )}

                              <IconButton
                                onClick={() => handlePageChangeintern(currentPageintern + 1)}
                                disabled={currentPageintern === totalPagesintern}
                                sx={{
                                  borderRadius: "50%",
                                  backgroundColor: "#e0e0e0",
                                  "&:hover": { backgroundColor: "#c0c0c0" },
                                }}
                              >
                                <Icon>keyboard_arrow_right</Icon>
                              </IconButton>
                            </SoftPagination>
                          </Box>
                        </>
                      )}
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <InfoIcon sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6">Please select a department to create groups.</Typography>
              </Box>
            )}
          </Box>

          <Box
            flex={1}
            border={1}
            borderColor="divider"
            borderRadius={2}
            p={2}
            m={1}
            display="flex"
            flexDirection="column"
            sx={{ minHeight: 400, position: "relative" }} // Added position relative
          >
            {selectedDepartment && (
              <SoftTypography variant="h6" fontWeight="medium">
                Existing Groups:
              </SoftTypography>
            )}
            {selectedDepartment ? (
              departmentGroups.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  <InfoIcon sx={{ fontSize: 50, mb: 2 }} />
                  <Typography variant="h6">No groups available in this department</Typography>
                </Box>
              ) : (
                <>
                  <SoftBox
                    mt={2}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mb={1}
                    sx={{
                      // Ensure the container takes up all available space
                      height: "100%",
                    }}
                  >
                    {/* Display Groups */}
                    <Box display="flex" flexDirection="column" gap={2} mb={1} sx={{ flexGrow: 1 }}>
                      {currentGroups.map((group) => {
                        const isExpired = new Date(group.expirationDate) < new Date();
                        return (
                          <Box
                            key={group.id}
                            display="flex"
                            flexDirection="column"
                            borderRadius={2}
                            p={2}
                            sx={{
                              backgroundColor: "#ffffff",
                              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              border: "1px solid #e0e0e0",
                              position: "relative",
                              overflow: "hidden",
                              opacity: isExpired ? 0.5 : 1,
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "4px",
                                height: "100%",
                                backgroundColor: "#4caf50",
                                borderTopLeftRadius: "2px",
                                borderBottomLeftRadius: "2px",
                              },
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              mb={1}
                            >
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ color: "#333", display: "flex", alignItems: "center" }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "#4caf50",
                                    marginRight: 1,
                                  }}
                                />
                                {group.name}
                              </Typography>
                              <Box>
                                <IconButton
                                  onClick={() => handleViewDetails(group.id)}
                                  sx={{
                                    color: "#007bff",
                                    "&:hover": { backgroundColor: "#e0e0e0" },
                                  }}
                                  disabled={isExpired}
                                >
                                  <Icon>info</Icon>
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDelete(group.id)}
                                  sx={{
                                    color: "#dc3545",
                                    "&:hover": { backgroundColor: "#f8d7da" },
                                  }}
                                  disabled={isExpired}
                                >
                                  <Icon>delete</Icon>
                                </IconButton>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                              Expiration Date: {group.expirationDate}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Members: {group.stagiaires.length}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>

                    {/* Pagination Container */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2,
                      }}
                    >
                      <SoftPagination
                        variant="gradient"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <IconButton
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          sx={{
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            "&:hover": { backgroundColor: "#c0c0c0" },
                          }}
                        >
                          <Icon>keyboard_arrow_left</Icon>
                        </IconButton>
                        {currentGroup > 0 && (
                          <Button onClick={() => setCurrentGroup(currentGroup - 1)}>...</Button>
                        )}

                        {renderPageButtons()}

                        {totalPages > (currentGroup + 1) * buttonsPerPage && (
                          <Button onClick={() => setCurrentGroup(currentGroup + 1)}>...</Button>
                        )}

                        <IconButton
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          sx={{
                            borderRadius: "50%",
                            backgroundColor: "#e0e0e0",
                            "&:hover": { backgroundColor: "#c0c0c0" },
                          }}
                        >
                          <Icon>keyboard_arrow_right</Icon>
                        </IconButton>
                      </SoftPagination>
                    </Box>
                  </SoftBox>
                </>
              )
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <InfoIcon sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6">
                  Please select a department to view existing groups
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
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
    </DashboardLayout>
  );
};

export default Groups;
