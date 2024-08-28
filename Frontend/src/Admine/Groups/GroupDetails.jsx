import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGroupStore from "store/GroupsStore";
import useCollaboratorStore from "store/collaboratorStore";

import { Grid, Card, Box, } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import ConfirmationModal from "components/ConfirmationModals";
import toast from "react-hot-toast";
import ProjectsSection from "layouts/profile/customComponents/ProjectsSection";
import InfoGroupCard from "./components/InfoGroupCard";
import CollaboratorsInternsCard from "./components/CollaboratorsInternsCard";
import DetailsHeader from "./components/DetailsHeader";
import { Backdrop } from "@mui/material";
import { DNA } from 'react-loader-spinner';
const GroupDetails = () => {
  const { id } = useParams();
  const fetchGroupById = useGroupStore((state) => state.fetchGroupById);
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const [group, setGroup] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  const [loading, setLoading] = useState(false);


  const [refresh, setRefresh] = useState(false); //this state is added to trigger the update in this component when the name changed in the CustonInfoCard so the header get the up to date value of name at real time

  const handleDataUpdate = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger useEffect
  };

  useEffect(() => {

    const extractInterns = (periods) => {

      const internIds = new Set(periods.map(period => period.internId));

      return Array.from(internIds);
    };

    const fetchGroupData = async () => {
      setLoading(true);
      try {
        const fetchedGroup = await fetchGroupById(id);
        if (fetchedGroup) {
          setGroup(fetchedGroup);
          setGroupName(fetchedGroup.name);
          setDescription(fetchedGroup.description);
          setExpirationDate(fetchedGroup.expirationDate);
          setSubjects(fetchedGroup.subjects || []);


          const internIds = extractInterns(fetchedGroup.periods || []);
          setSelectedInterns(internIds);

          setSelectedDepartment(fetchedGroup.department);
          setSelectedCollaborator(fetchedGroup.collaborator);
        }
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
      finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchGroupData();
  }, [id, fetchGroupById, refresh]);



  const handleSave = () => {
    setConfirmationModalTitle("Confirm Save");
    setConfirmationModalDescription("Are you sure you want to save the changes?");
    setOnConfirmAction(() => () => {
      const updatedGroup = {
        ...group,
        name: groupName,
        description,
        expirationDate,
        newInternIds: selectedInterns,
        department: selectedDepartment,
        collaboratorId: selectedCollaborator.id,
        subjects,
      };
      useGroupStore.getState().updateGroup(id, updatedGroup);
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

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };
  const getCollaboratorNameById = (id) => {
    const collaborator = collaborators.find((collaborator) => collaborator.id === id);
    return collaborator ? collaborator.name : "Unknown Collaborator";
  };

  const handleEditCollaborator = (collaborator) => {
    setSelectedCollaborator(collaborator);
    handleDataUpdate();
  };

  return (
    <DashboardLayout>
      <DetailsHeader name={groupName} />
      <Box mt={5} mb={3} px={6}>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <InfoGroupCard
              group={group}
              groupName={groupName}
              description={description}
              expirationDate={expirationDate}
              department={group?.department}
              onUpdate={handleDataUpdate}
              onEditToggle={handleEditToggle}
              setGroup={setGroup}
              newInternIds={selectedInterns}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ProjectsSection subjects={subjects} onRefresh={handleDataUpdate} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} spacing={3} mt={3}>
          <CollaboratorsInternsCard
            group={group}
            department={selectedDepartment}
            selectedInterns={selectedInterns}

            // remainingInterns={filteredStagiaires}
            collaborator={selectedCollaborator}
            // remainingCollaborators={filteredCollaborators}
            onEditCollaborator={handleEditCollaborator}
            onUpdate={handleDataUpdate}
          />
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
    </DashboardLayout>
  );
};

export default GroupDetails;
