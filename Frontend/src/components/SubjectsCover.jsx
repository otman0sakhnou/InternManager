/* eslint-disable react/prop-types */
/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useState, useEffect } from "react";
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";
// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Box, AppBar, Card, Tab, Tabs, LinearProgress } from "@mui/material";
import SoftAvatar from "./SoftAvatar";
import Cube from "examples/Icons/Cube";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import burceMars from "assets/images/icons8-projet-64.png";


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress color="success" variant="determinate" {...props} />
      </Box>
      <Box sx={{width:'fit-content'}}>
        <SoftTypography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</SoftTypography>
      </Box>
    </Box>
  );
}
function SubjectsCover({ title = "", description = "",type, image, children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [progress, setProgress] = useState(10);


  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);


  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  return (
    <SoftBox position="relative">
      <DashboardNavbar absolute light />
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid container spacing={3} justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={10} lg={4}>
            <SoftBox mt={10} mb={1} >
              <SoftTypography variant="h1" color="white" fontWeight="bold">
                {title}
              </SoftTypography>
            </SoftBox>
            <SoftBox mb={2}>
              <SoftTypography variant="body2" color="white" fontWeight="regular">
                {description}
              </SoftTypography>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
      <Card sx={{
        backdropFilter: `saturate(200%) blur(30px)`,
        backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
        boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
        position: "relative",
        mt: -6,
        mx: 3,
        py: 2,
        px: 2,
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={burceMars}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                Team
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {title} / {type}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={2} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent" }}
              >
                <Tab label="Back to team details" icon={<ArrowBackIosIcon />} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid></Card>
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card sx={{ p: 3 }}>
              {children}
            </Card>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Card sx={{ p: 3 }}>
              <SoftTypography variant="h5" fontWeight="bold">
                Tracking the team Progress
              </SoftTypography>
              <Box mt={2}>
                <SoftTypography variant="body2" fontWeight="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgressWithLabel  value={progress} />
                    </Box>
                  </Box>
                </SoftTypography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the BasicLayout
SubjectsCover.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default SubjectsCover;
