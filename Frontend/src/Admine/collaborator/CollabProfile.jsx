import React from 'react'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "layouts/profile/components/Header";
import { useParams } from 'react-router-dom';
import useCollaboratorStore from 'store/collaboratorStore';

import Footer from "examples/Footer";

function CollabProfile() {
  const { id } = useParams();
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const collaborator = collaborators.find((c) => c.id === Number(id));

  if (!collaborator) {
    return <DashboardLayout>User not found</DashboardLayout>;
  }
  return (
    <DashboardLayout>
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="large">
                  Profile Information
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Email: {collaborator.email}
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Phone: {collaborator.phone}
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Job: {collaborator.job}
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Department: {collaborator.department}
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Organization: {collaborator.organization}
                </SoftTypography>
                <SoftTypography variant="body1" color="text">
                  Employment Date: {collaborator.employementDate}
                </SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  )
}

export default CollabProfile