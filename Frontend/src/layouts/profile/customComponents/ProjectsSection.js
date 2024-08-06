import React from 'react'
import { useParams, useNavigate } from "react-router-dom";


import Card from "@mui/material/Card";
import { Grid } from '@mui/material';
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import ProjectCard from './ProjectCard';
import useSubjectStore from 'store/useSubjectStore';

const ProjectsSection = () => {
  const subjects = useSubjectStore(state=>state.subjects);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("S", id);
  const addSubject = () => {
    console.log("navigate to add subjects component");
    navigate(`/Add-Subject/${id}`);
  }
  const subjectDetails=(id)=>{
    navigate(`/subject/${id}`);
  }
  return (
    <Card>
      <SoftBox pt={2} px={2}>
        <SoftBox mb={0.5} display="flex" alignItems="center" justifyContent="space-between" >
          <SoftTypography variant="h6" fontWeight="medium">
            Subjects
          </SoftTypography>
        </SoftBox>
      </SoftBox>
      <SoftBox p={2}>
        <Grid container spacing={3}>
          {subjects.map((subject) => (
            <Grid
              key={subject.id}
              item
              xs={12}
              mx={1}
              onClick={() => subjectDetails(subject.id)}
            >
              <ProjectCard subject={subject}/>
            </Grid>
          ))}
          <Grid onClick={addSubject} item xs={12}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                cursor: 'pointer',
              },
            }}>
            <PlaceholderCard title={{ variant: "h6", text: "New project" }} outlined />
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default ProjectsSection;