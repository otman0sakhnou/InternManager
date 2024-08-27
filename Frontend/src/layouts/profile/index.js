import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
// import useAuthStore from "store/AuthStore"; // Ensure you import the correct store
import useCollaboratorStore from "store/collaboratorStore"; // Ensure you import the correct store
import useStagiaireStore from "store/InternStore"; // Ensure you import the correct store
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import SoftBox from "../../components/SoftBox";
import Grid from "@mui/material/Grid";
import InternStepsCard from "./customComponents/InternStepsCard";

import InternStepsCard from "./customComponents/InternStepsCard"
import { Grid, Backdrop } from "@mui/material";
import { DNA } from 'react-loader-spinner';

import Header from "./components/Header";
import ProfessionalInfoCard from "./customComponents/ProfessionalInfoCard";
import TeamsCard from "./customComponents/TeamsCard";
import Footer from "examples/Footer";
import CustomProfileInfoCard from "./customComponents/CustomProfileInfoCard";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useSelectedUserRoleStore from "store/useSelectedUserRoleStore";
import useAuthStore from "store/useAuthStore";

function Overview() {
  const { id: selectedUserId } = useParams(); // Extract ID from route parameters
  console.log(selectedUserId)
  // const role = useAuthStore((state) => state.role);
  const location = useLocation(); //to get the current route
  console.log(location.pathname)

  const { user, isAuthenticated, roles } = useAuthStore();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  console.log("**************************")
  console.log(error)
  const [refresh, setRefresh] = useState(false); //this state is added to trigger the update in this component when the name changed in the CustonInfoCard so the header get the up to date value of name at real time

  const {
    fetchSelectedUserRole,
    fetchRolesByCollaboratorId,
    fetchRolesByInternId,
    selectedUserRole,
    isLoading: roleLoading,
  } = useSelectedUserRoleStore();
  console.log(selectedUserRole);

  const { getCollaborator, getCollaboratorByUserId } = useCollaboratorStore();
  const { getStagiaireById, getInternByUserId } = useStagiaireStore();

  //to determine if the current user is viewing their own profile or someone's else
  const isViewingOwnProfile = !selectedUserId;
  console.log(isViewingOwnProfile)

  useEffect(() => {
    console.log("the useEffect will run again")
    const fetchRoles = async () => {
      try {
        if (location.pathname.includes("/profile")) {
          await fetchSelectedUserRole(user.userId);
        } else if (location.pathname.includes("/Collaborator/Profile")) {
          console.log("this is the right function")
          await fetchRolesByCollaboratorId(selectedUserId);
        } else if (location.pathname.includes("/Intern/Profile")) {
          await fetchRolesByInternId(selectedUserId);
        }
      } catch (err) {
        setError("An error occured while fetching the roles.");
      }
    };
    if (
      selectedUserId ||
      roles.includes("Admin") ||
      roles.includes("Manager") ||
      roles.includes("Collaborator")
    ) {
      fetchRoles();
      console.log(selectedUserRole);
    }
  }, [
    selectedUserId,
    location.pathname,
    fetchSelectedUserRole,
    fetchRolesByCollaboratorId,
    fetchRolesByInternId,
    roles,
    user.userId,
  ]);

  console.log(selectedUserRole)

  useEffect(() => {
    const fetchData = async () => {
      setError(null); //Reset error state when fetching new data
      console.log("fetching data");
      try {
        if (isViewingOwnProfile) {
          if (roles.includes("Collaborator") || roles.includes("Manager")) {
            const collaborator = await getCollaboratorByUserId(user.userId);
            setData(collaborator);
          } else if (roles.includes("Intern")) {
            const intern = await getInternByUserId(user.userId);
            setData(intern);
          } else {
            return;
          }
        } else {
          console.log("hello");
          if (selectedUserId) {
            if (
              roles.includes("Admin") ||
              roles.includes("Collaborator") ||
              roles.includes("Manager")
            ) {
              if (selectedUserRole === "Collaborator" || selectedUserRole === "Manager") {
                console.log("annyeong");
                const collaborator = await getCollaborator(selectedUserId);
                setData(collaborator);
                console.log("after setting the data");
              } else if (selectedUserRole === "Intern") {
                console.log("annyeong for intern");
                const intern = await getStagiaireById(selectedUserId);
                setData(intern);
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch data. Please try again later.");
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedUserId, getCollaborator, getStagiaireById, refresh, roles, user, selectedUserRole]);
  console.log(data);

  const handleDataUpdate = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger useEffect
  };

  if (isViewingOwnProfile && roles[0] === "Admin") {
    return (
      <DashboardLayout>
        <Header
          key={user.userId}
          isViewingOwnProfile={isViewingOwnProfile}
          name={user.userName}
          gender={user.gender}
        />
        <Footer />
      </DashboardLayout>
    );
  }

  if (error){
    return <div>{error}</div>;
  } 
  // if (!data || roleLoading) return <div>Loading...</div>; // Handle loading state
  // const latestPeriod = data.periods?.reduce(
  //   (latest, current) => (new Date(current.endDate) > new Date(latest.endDate) ? current : latest),
  //   data.periods[0]
  // );
  // if (roleLoading) return <div>Loading...</div>;
  if (loading || roleLoading) {
    return (
      <Backdrop
        sx={{
          color: "#ff4",
          backgroundImage: "linear-gradient(135deg, #ced4da 0%, #ebeff4 100%)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
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
    );
  }

  if (!data) return <div>No data found</div>; // Handle loading state
  const latestPeriod = data.periods?.reduce((latest, current) =>
    new Date(current.endDate) > new Date(latest.endDate) ? current : latest
    , data.periods[0]);

  const profileAction = {
    route: "/edit-profile",
    tooltip: "Edit Profile",
  };

  const info =
    selectedUserRole === "Intern" || roles[0] === "Intern"
      ? {
          id: data.id,
          institution: data.institution,
          level: data.level,
          specialization: data.specialization,
          yearOfStudy: data.yearOfStudy,
          title: data.title,
          department: data.department,
          startDate: latestPeriod?.startDate,
          endDate: latestPeriod?.endDate,
        }
      : {
          id: data.id,
          department: data.department,
          employmentDate: data.employmentDate,
          title: data.title,
          organization: data.organization,
        };

  return (
    <DashboardLayout>
      <Header
        key={data.id}
        isViewingOwnProfile={isViewingOwnProfile}
        name={data.name}
        gender={data.gender}
      />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
            <CustomProfileInfoCard
              title="Profile Information"
              info={{
                id: data.id,
                name: data.name,
                phone: data.phone,
                email: data.user?.email,
                gender: data.gender,
              }}
              role={selectedUserId ? selectedUserId : roles[0]}
              isViewingOwnProfile={isViewingOwnProfile}
              action={profileAction}
              onUpdate={handleDataUpdate}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ProfessionalInfoCard
                title="Professional Information"
                info={info}
                isViewingOwnProfile={isViewingOwnProfile}
                action={{ route: "", tooltip: "Edit" }}
                role={selectedUserId ? selectedUserRole : roles[0]}
              />
            </LocalizationProvider>
          </Grid>
          <TeamsCard
            id={data.id}
            role={selectedUserId ? selectedUserRole : roles[0]}
            isViewingOwnProfile={isViewingOwnProfile}
          />
          {/* {selectedUserRole=="Intern" && <InternStepsCard/>} */}
        </Grid>
      </SoftBox>
      <Footer />

    </DashboardLayout>
  );
}

export default Overview;
