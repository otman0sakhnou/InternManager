import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "store/AuthStore"; // Ensure you import the correct store
import useCollaboratorStore from "store/collaboratorStore"; // Ensure you import the correct store
import useStagiaireStore from "store/InternStore"; // Ensure you import the correct store
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import SoftBox from "../../components/SoftBox";

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

function Overview() {
  console.log(useStagiaireStore((state) => state.stagiaires));
  const { id } = useParams(); // Extract ID from route parameters
  const role = useAuthStore((state) => state.role);
  const [data, setData] = useState(null);

  const [refresh, setRefresh] = useState(false);  //this state is added to trigger the update in this component when the name changed in the CustonInfoCard so the header get the up to date value of name at real time

  const getCollaborator = useCollaboratorStore((state) => state.getCollaborator);
  const getStagiaireById = useStagiaireStore((state) => state.getStagiaireById);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (role === "collaborator") {
        const collaborator = await getCollaborator(id);
        console.log("Fetched collaborator:", collaborator);
        setData(collaborator);
      } else {
        const intern = getStagiaireById(id);
        setData(intern);
      }
      setLoading(false);
    };

    fetchData();
  }, [id, role, getCollaborator, getStagiaireById, refresh]);

  const handleDataUpdate = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger useEffect
  };

  if (loading) {
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
    role === "intern"
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
      <Header key={data.id} name={data.name} gender={data.gender} />
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
              action={profileAction}
              onUpdate={handleDataUpdate}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ProfessionalInfoCard
                title="Professional Information"
                info={info}
                action={{ route: "", tooltip: "Edit" }}
                role={role}
              />
            </LocalizationProvider>
          </Grid>
          <TeamsCard id={data.id} />
          {role == "intern" && <InternStepsCard />}
        </Grid>
      </SoftBox>
      <Footer />

    </DashboardLayout>
  );
}

export default Overview;
