import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

import Card from "@mui/material/Card";
import { Grid } from '@mui/material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import ProjectCard from './ProjectCard';

const ProjectsSection = ({ subjects = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const addSubject = () => {
    navigate(`/Add-Subject/${id}`);
  };





  return (
    <Card sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
      <SoftBox pt={2} px={2}>
        <SoftBox mb={0.5} display="flex" alignItems="center" justifyContent="space-between">
          <SoftTypography variant="h6" fontWeight="medium">
            Subjects
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      <SoftBox p={2} flex="1">
        <Grid container spacing={3} sx={{ flexGrow: 1 }}>
          {subjects.map((subject) => (
            <Grid
              key={subject.id}
              item
              xs={12}
              mx={1}
            >
              <ProjectCard subject={subject} />
            </Grid>
          ))}
          <Grid
            onClick={addSubject}
            item
            xs={12}
            sx={{

              marginTop: '4%',
              cursor: 'pointer',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <PlaceholderCard title={{ variant: "h6", text: "New project" }} outlined />
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
};

ProjectsSection.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default ProjectsSection;
