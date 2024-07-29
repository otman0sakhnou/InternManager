import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "store/AuthStore"; // Ensure you import the correct store
import useCollaboratorStore from "store/collaboratorStore"; // Ensure you import the correct store
import useStagiaireStore from "store/InternStore"; // Ensure you import the correct store
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import SoftBox from "../../components/SoftBox";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
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

  const getCollaboratorById = useCollaboratorStore((state) => state.getCollaboratorById);
  const getStagiaireById = useStagiaireStore((state) => state.getStagiaireById);

  useEffect(() => {
    const fetchData = async () => {
      if (role === "collaborator") {
        const collaborator =  getCollaboratorById(Number(id));
        console.log("Fetched collaborator:", collaborator);
        setData(collaborator);
      } else {
        const intern = getStagiaireById(Number(id));
        console.log("Fetched intern:", intern);
        setData(intern);
      }
    };

    fetchData();
  }, [id, role, getCollaboratorById, getStagiaireById, refresh]);

  const handleDataUpdate = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger useEffect
  };

  console.log(data)

  if (!data) return <div>Loading...</div>; // Handle loading state

  const profileAction = {
    route: "/edit-profile",
    tooltip: "Edit Profile",
  };

  const info =
    role === "intern"
      ? {
          id: data.id,
          institution: data.educationInfo.institution,
          level: data.educationInfo.level,
          specialization: data.educationInfo.specialization,
          yearOfStudy: data.educationInfo.yearOfStudy,
          title: data.internshipInfo.title,
          department: data.internshipInfo.department,
          startDate: data.internshipInfo.startDate.format("YYYY-MM-DD"),
          endDate: data.internshipInfo.endDate,
        }
      : {
          id: data.id,
          department: data.department,
          employmentDate: data.employementDate,
          job: data.job,
          organization: data.organization,
        };

  return (
    <DashboardLayout>
      <Header key={data.id} name={data.name} avatarIcon={<Icon>face</Icon>} />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
            <CustomProfileInfoCard
              title="Profile Information"
              info={{
                id: data.id,
                name: data.name,
                phone: data.phone,
                email: data.email,
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
          <TeamsCard />
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
