import React from 'react'
// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

import Card from "@mui/material/Card";
import { Grid } from '@mui/material';
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import ProjectCard from './ProjectCard';
import { Add } from '@mui/icons-material';
import {IconButton } from '@mui/material';

const subjects = [
  { name: "Project A", type: "Project" },
  { name: "Training B", type: "Training" },
];

const ProjectsSection = () => {
  return (
    <Card>
      <SoftBox pt={2} px={2}>
        <SoftBox mb={0.5} display="flex" alignItems="center" justifyContent="space-between" > 
          <SoftTypography variant="h6" fontWeight="medium">
            Subjects
          </SoftTypography>
          <IconButton
            color="info"
            onClick={() => navigate(`/create-subject/${id}`)}
            sx={{
              bgcolor: "#e1f5fe",
              "&:hover": { bgcolor: "#b3e5fc" },
              borderRadius: "50%",
              p: 1,
              boxShadow: 2,
            }}
          >
            <Add />
          </IconButton>
        </SoftBox>
        {/* <SoftBox mb={1}>
          <SoftTypography variant="button" fontWeight="regular" color="text">
            Architects design houses
          </SoftTypography>
        </SoftBox> */}
      </SoftBox>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {subjects.map((subject, index) => (
              <ProjectCard key={index} name={subject.name} title={subject.type} />
            ))}
          </Grid>
          {/* <Grid item xs={12} md={6} xl={3}>
            <DefaultProjectCard
              image={homeDecor3}
              label="project #3"
              title="minimalist"
              description="Different people have different taste, and various types of music."
              action={{
                type: "internal",
                route: "/pages/profile/profile-overview",
                color: "info",
                label: "view project",
              }}
              authors={[
                { image: team4, name: "Peterson" },
                { image: team3, name: "Nick Daniel" },
                { image: team2, name: "Ryan Milly" },
                { image: team1, name: "Elena Morison" },
              ]}
            />
          </Grid> */}
          <Grid item xs={12}>
            <PlaceholderCard title={{ variant: "h6", text: "New project" }} outlined />
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default ProjectsSection