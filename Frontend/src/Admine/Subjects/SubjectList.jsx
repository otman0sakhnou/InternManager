//subject list 
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider, Grid } from '@mui/material';
import curved6 from "assets/images/curved-images/curved14.jpg";
import SubjectsCover from 'components/SubjectsCover';
import SoftTypography from 'components/SoftTypography';
import { useGroupName } from 'context/GroupeNameContext';
import TrackingteamComponent from './TrackingteamComponent';


const SubjectList = ({ subjects }) => {
  const { groupNameC } = useGroupName();
  if (subjects.length === 0) {
    return <SoftTypography variant="h4" color="dark" fontWeight="bold" textGradient>No subjects available.</SoftTypography>;
  }

  return (
    <>
      {subjects.map((subject, index) => (
        <SubjectsCover
          key={index}
          title={subject.title}
          description="Discover key information about the selected subject, including objectives, and main topics. Perfect for interns and supervisors alike."
          image={curved6}
          type={subject.type}
          team={groupNameC}
        >
          <Box p={3}>
            <SoftTypography variant='h2' mb={2} color='dark' textGradient>
              Subject Details
            </SoftTypography>
            <Divider sx={{ mb: 2 }} />
            <SoftTypography variant="body1" textGradient color='dark' mb={2}>
              <strong>Description:</strong>
            </SoftTypography>
            <Box
              sx={{
                border: '1px solid #ddd',
                borderRadius: 1,
                py: 2,
                px:5,
                mb: 2,
                maxWidth: '100%',
                overflow: 'auto',
              }}
            >
              <div  dangerouslySetInnerHTML={{ __html: subject.description }} />
            </Box>
            <SoftTypography variant="body1" textGradient color='dark' mb={2}>
              <strong>Steps:</strong>
            </SoftTypography>
            {subject.steps.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No steps available.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {subject.steps.map((step, idx) => (
                  <Grid
                    item
                    xs={12}
                    md={2}
                    key={idx}
                    sx={{
                      my: 2,
                      mx: 2,
                      p: 2,
                      border: '1px solid #d1d9ff',
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #4a6cff, #4ad0fd)',
                      '&:hover': {
                        backgroundColor: '#e1eaff',
                      },
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'left',
                      boxShadow: 1,
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: 10,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        color: '#3f51b5',
                        backgroundColor: '#fff',
                        padding: '0 5px',
                        borderRadius: 1,
                        boxShadow: 1,
                      }}
                    >
                      Step {idx + 1}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#fff',
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          <TrackingteamComponent subjectId={subject.id} groupId={subject.groupId}/>
        </SubjectsCover>
      ))}
    </>
  );
};

SubjectList.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      steps: PropTypes.arrayOf(
        PropTypes.shape({
          description: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default SubjectList;
