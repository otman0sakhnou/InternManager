import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton"; // Use IconButton for clickable icon
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard React examples
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Soft UI Dashboard React icons
import ArrowBack from "@mui/icons-material/ArrowBack"; // Use appropriate back arrow icon
import Document from "examples/Icons/Document";
import Settings from "examples/Icons/Settings";
import curved0 from "assets/images/curved-images/curved0.jpg";
// Soft UI Dashboard React base styles
import breakpoints from "assets/theme/base/breakpoints";
import maleAvatar from "assets/avatars/male-avatar-maker-2a7919.webp"
import femaleAvatar from 'assets/avatars/1e599ceb-ce32-4588-b931-f1dd33c99b37.jpg'


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
const avatarStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "#fff",
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
};

function Header({ name, gender , isViewingOwnProfile}) {
  const navigate = useNavigate(); // Initialize navigate function

  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      navigate(-1); // Navigate back to the previous page
    }
  };

  const avatarImage = gender && getAvatarImage(gender)

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
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${curved0})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            {gender && (
              <SoftAvatar
                variant="rounded"
                size="xl"
                shadow="sm"
                src={avatarImage}
                alt={name}
                sx={{ bgcolor: "primary" }}
              />
            )}
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {name}
              </SoftTypography>
              {/* <SoftTypography variant="button" color="text" fontWeight="medium">
                {title}
              </SoftTypography> */}
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleTabChange}
                sx={{ background: "transparent" }}
              >
                {!isViewingOwnProfile && (
                  <Tab
                    label="Go Back"
                    icon={<ArrowBack />}
                    onClick={() => navigate(-1)} // Handle click directly
                  />
                )}
                <Tab label="Message" icon={<Document />} />
                <Tab label="Settings" icon={<Settings />} />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
  gender: PropTypes.string,
  isViewingOwnProfile: PropTypes.bool.isRequired,
};

export default Header;
