import React, { useEffect, useState } from 'react';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { Grid, Box, Typography, Paper, Icon, Tooltip, Button } from '@mui/material';
import SoftTypography from 'components/SoftTypography';
import SoftProgress from 'components/SoftProgress';
import StyledIcon from 'components/StyledIcon';
import DefaultDoughnutChart from 'examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import SoftPagination from 'components/SoftPagination';
import SoftBox from 'components/SoftBox';
import chroma from 'chroma-js';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';

function TrackingteamComponent() {
  const [colors, setColors] = useState([]);

  const steps = [
    { name: 'HTML Basics', progress: 100, internsCompleted: 30, interns: ["jhon doe", "intern1", "intern2", "intern3", "intern4", "intern5", "intern6"] },
    { name: 'CSS Fundamentals', progress: 80, internsCompleted: 24, interns: ["jhon doe"] },
    { name: 'JavaScript Intro', progress: 50, internsCompleted: 15, interns: ["jhon doe", "intern1"] },
    { name: 'DOM Manipulation', progress: 60, internsCompleted: 18, interns: ["jhon doe", "intern1", "intern2"] },
    { name: 'Responsive Design', progress: 40, internsCompleted: 12, interns: ["jhon doe", "intern1", "intern2"] },
    { name: 'Advanced CSS', progress: 30, internsCompleted: 10, interns: ["jhon doe"] },
    { name: 'React Basics', progress: 20, internsCompleted: 5, interns: ["jhon doe", "intern1"] },
    { name: 'React Basics', progress: 20, internsCompleted: 5, interns: ["jhon doe"] },
    { name: 'React Basics', progress: 20, internsCompleted: 5, interns: ["jhon doe", "intern1", "intern2"] },
    { name: 'React Basics', progress: 20, internsCompleted: 5, interns: ["jhon doe", "intern4", "intern5", "intern6", "intern4", "intern5", "intern6"] }
  ];

  const stepsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalSteps = steps.length;
  const totalPages = Math.ceil(totalSteps / stepsPerPage);
  const [visibleInterns, setVisibleInterns] = useState({});

  useEffect(() => {
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
  }, [steps.length]);
  
  // Chart configuration with custom colors
  const chartConfig = {
    labels: steps.map(step => step.name),
    datasets: [
      {
        label: 'Interns Completed',
        customColors: colors,
        data: steps.map(step => step.internsCompleted),
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
              Intro to Web Development
            </SoftTypography>
            <Typography variant="body2" color="textSecondary">
              {totalSteps} steps | {((steps.reduce((acc, step) => acc + step.internsCompleted, 0) / (totalSteps * 30)) * 100).toFixed(2)}% complete
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8}>
        <Grid container spacing={2}>
          {steps.slice((currentPage - 1) * stepsPerPage, currentPage * stepsPerPage).map((step, index) => (
            <Grid item xs={12} key={index}>
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
                    {step.name}
                  </SoftTypography>
                  <SoftProgress value={step.progress} alignItems='end' color="warning" variant="gradient" label={true} sx={{ width: '100%' }} />
                  <SoftBox display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    sx={{
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }} mt={0.5}>
                    <SoftTypography variant="caption" color="dark" textGradient sx={{ marginRight: '8px' }} >Completed by :</SoftTypography>
                    {step.interns.slice(0, visibleInterns[index] ? step.interns.length : 3).map((intern, internIndex) => (
                      <Tooltip key={internIndex} title={intern}>
                        <StyledIcon sx={{ fontSize: 'small', marginRight: '4px', cursor: 'pointer' }}>
                          <HowToRegOutlinedIcon />
                        </StyledIcon>
                      </Tooltip>
                    ))}
                    {step.interns.length > 5 && (
                      <Button size="small" onClick={() => handleToggleInterns(index)}>
                        {visibleInterns[index] ? 'Show less' : `+${step.interns.length - 3} more`}
                      </Button>
                    )}
                  </SoftBox>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <SoftBox display="flex" justifyContent="center" p={2}>
          <SoftPagination variant="gradient">
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

      <Grid item xs={12} mt={4}>
        <Paper
          elevation={3}
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
            <SoftProgress value={(steps.reduce((acc, step) => acc + step.progress, 0) / totalSteps).toFixed(2)} color="success" variant="gradient" />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default TrackingteamComponent;
