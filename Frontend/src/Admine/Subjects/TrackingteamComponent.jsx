/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { Grid, Box, Typography, Paper, Icon, Tooltip, Button, Backdrop } from '@mui/material';
import SoftTypography from 'components/SoftTypography';
import SoftProgress from 'components/SoftProgress';
import StyledIcon from 'components/StyledIcon';
import DefaultDoughnutChart from 'examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import SoftPagination from 'components/SoftPagination';
import SoftBox from 'components/SoftBox';
import chroma from 'chroma-js';
import teamProgressStore from 'store/teamProgressStore';
import SoftAvatar from 'components/SoftAvatar';
import femaleAvatar from "assets/avatars/1e599ceb-ce32-4588-b931-f1dd33c99b37.jpg";
import maleAvatar from "assets/avatars/male-avatar-maker-2a7919.webp";
import { DNA } from 'react-loader-spinner';

function TrackingteamComponent({ subjectId, groupId }) {
  const [colors, setColors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleInterns, setVisibleInterns] = useState({});

  const { teamProgress, loading, error, fetchTeamProgress } = teamProgressStore(state => ({
    teamProgress: state.teamProgress,
    loading: state.loading,
    error: state.error,
    fetchTeamProgress: state.fetchTeamProgress,
  }));

  useEffect(() => {
    fetchTeamProgress(subjectId, groupId);
  }, [fetchTeamProgress, subjectId, groupId]);

  useEffect(() => {
    if (teamProgress && teamProgress.subjects) {
      const steps = teamProgress.subjects[0]?.steps || [];
      const generateColors = (numColors) => {
        const colorsArray = [];
        for (let i = 0; i < numColors; i++) {
          const color = chroma.random().hex();
          colorsArray.push(color);
        }
        return colorsArray;
      };
      const generatedColors = generateColors(steps.length);
      setColors(generatedColors);
    }
  }, [teamProgress]);

  const getAvatarImage = (gender) => {
    switch (gender.toLowerCase()) {
      case "male":
        return maleAvatar;
      case "female":
        return femaleAvatar;
      default:
        return null;
    }
  };
  if (loading) {
    return <Backdrop
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
    </Backdrop>;
  }

  if (error || !teamProgress || !teamProgress.subjects || teamProgress.subjects.length === 0) {
    return <Typography>Error loading data or no subjects available.</Typography>;
  }

  const subject = teamProgress.subjects[0];
  const steps = subject?.steps || [];

  const stepsPerPage = 5;
  const totalSteps = steps.length;
  const totalPages = Math.ceil(totalSteps / stepsPerPage);

  const progressColor=(progressValue)=>{
    let color;
    progressValue <= 30 ? color= "error" : progressValue <= 70 ? color ="warning" : color ="success"
    console.log("color :",color)
    return color;  
  };

  const chartConfig = {
    labels: steps.map(step => step.description),
    datasets: [
      {
        label: 'Interns Completed',
        customColors: colors,
        data: steps.map(step => step.completedByInterns.length),
      },
    ],
  };

  const handleToggleInterns = (stepIndex) => {
    setVisibleInterns((prev) => ({
      ...prev,
      [stepIndex]: !prev[stepIndex],
    }));
  };

  const getPaginationRange = () => {
    const totalDisplayedPages = 3;
    const halfRange = Math.floor(totalDisplayedPages / 2);

    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage < totalDisplayedPages - 1) {
      startPage = Math.max(1, endPage - totalDisplayedPages + 1);
    }

    return { startPage, endPage };
  };

  const { startPage, endPage } = getPaginationRange();
  const paginationRange = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const handlePagination = (page) => setCurrentPage(page);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} mb={2}>
        <Box display="flex" alignItems="center">
          <StyledIcon fontSize="large">
            <AssessmentRoundedIcon />
          </StyledIcon>

          <Box ml={2}>
            <SoftTypography variant="h4" color="dark" fontWeight="bold" textGradient>
              {subject?.title || "No Title Available"}
            </SoftTypography>
            <Typography variant="body2" color="textSecondary">
              {totalSteps} steps | {subject?.subjectProgress || 0}% complete
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Grid container spacing={2}>
          {steps.slice((currentPage - 1) * stepsPerPage, currentPage * stepsPerPage).map((step, index) => (
            <Grid item xs={12} key={step.stepId}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Box mb={2}>
                  <SoftTypography variant="body1" color="dark" fontWeight="bold" mb={1} textGradient sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    {step.description}
                  </SoftTypography>
                  <SoftProgress value={step.stepProgress} alignItems='end' color={progressColor(step.stepProgress)} variant="gradient" label={true} sx={{ width: '100%' }} />
                  <SoftBox display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }} mt={0.5}>
                    <SoftTypography variant="caption" color="dark" textGradient sx={{ marginRight: '8px' }} >Completed by :</SoftTypography>
                    {step.completedByInterns.slice(0, visibleInterns[index] ? step.completedByInterns.length : 3).map((intern, internIndex) => (
                      <Tooltip key={internIndex} title={intern.internName} placeholder="bottom">
                        <SoftAvatar
                          src={getAvatarImage(intern.gender)}
                          alt="name"
                          size="xs"
                          sx={{
                            border: ({ borders: { borderWidth }, palette: { white } }) =>
                              `${borderWidth[2]} solid ${white.main}`,
                            cursor: "pointer",
                            position: "relative",

                            "&:not(:first-of-type)": {
                              ml: -1.25,
                            },
                            "&:hover, &:focus": {
                              zIndex: "10",
                            },
                          }}
                        />
                      </Tooltip>
                    ))}
                    {step.completedByInterns.length > 3 && (
                      <Button size="small" onClick={() => handleToggleInterns(index)}>
                        {visibleInterns[index] ? 'Show less' : `+${step.completedByInterns.length - 3} more`}
                      </Button>
                    )}
                  </SoftBox>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <SoftBox display="flex" justifyContent="center" p={2}>
          <SoftPagination variant="gradient" size="small" color="primary">
            <SoftPagination item onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>
              <Icon>keyboard_arrow_left</Icon>
            </SoftPagination>
            {startPage > 1 && (
              <>
                <SoftPagination item onClick={() => handlePagination(1)}>
                  1
                </SoftPagination>
                {startPage > 2 && <SoftTypography variant="button" fontWeight="medium" color="text">...</SoftTypography>}
              </>
            )}
            {paginationRange.map((page) => (
              <SoftPagination
                key={page}
                item
                active={page === currentPage}
                onClick={() => handlePagination(page)}
              >
                {page}
              </SoftPagination>
            ))}
            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <SoftTypography variant="button" fontWeight="medium" color="text">...</SoftTypography>}
                <SoftPagination item onClick={() => handlePagination(totalPages)}>
                  {totalPages}
                </SoftPagination>
              </>
            )}
            <SoftPagination item onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages}>
              <Icon>keyboard_arrow_right</Icon>
            </SoftPagination>
          </SoftPagination>
        </SoftBox>
      </Grid>
      <Grid item xs={12} sm={4}>

        <DefaultDoughnutChart
          title="Interns' Step Completion Overview"
          description="This chart visualizes the number of interns who have successfully completed each step."
          chart={chartConfig}
          size="large"
        />
      </Grid>


      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
          }}
        >
        <Box>
            <SoftTypography variant="h6" fontWeight="bold" textGradient>
              Overall Progress
            </SoftTypography>
            <SoftProgress value={subject?.subjectProgress || 0} color={progressColor(subject.subjectProgress)} variant="gradient" label />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default TrackingteamComponent;
