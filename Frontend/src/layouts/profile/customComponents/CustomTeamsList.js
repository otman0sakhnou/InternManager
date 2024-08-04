// Import necessary libraries and components
import React from "react";

import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftAvatar from "components/SoftAvatar";

function CustomTeamsList({ title, teams }) {

  const navigate = useNavigate();
  const handleViewDetails = (id) => {
    navigate(`/groupdetails/${id}`);
  };

  const renderTeams = () => {
    if (teams.length === 0) {
      return (
        <SoftBox mb={2} textAlign="center" verticalALign="middle">
          <SoftTypography variant="caption" color="text">
            No teams available.
          </SoftTypography>
        </SoftBox>
      );
    }

    return teams.map(({ id ,name, description, icon }) => (
      <SoftBox key={name} component="li" display="flex" alignItems="center" py={1} mb={1}>
        <SoftBox
          mr={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          {icon ? (
            <SoftAvatar src={icon} alt="team icon" variant="rounded" shadow="md" />
          ) : (
            <Icon>group</Icon>
          )}
        </SoftBox>
        <SoftBox
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
        >
          <SoftTypography variant="button" fontWeight="medium">
            {name}
          </SoftTypography>
          <SoftTypography variant="caption" color="text">
            {description}
          </SoftTypography>
        </SoftBox>
        <SoftBox ml="auto">
          <SoftButton
            component={Link}
            onClick={() => handleViewDetails(id)}
            variant="text"
            color="info"
          >
            View
          </SoftButton>
        </SoftBox>
      </SoftBox>
    ));
  };

  return (
    <Card sx={{ height: "100%" }}>
      <SoftBox pt={2} px={2}>
        <SoftTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </SoftTypography>
      </SoftBox>
      <SoftBox p={2}>
        <SoftBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {renderTeams()}
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

// Typechecking props for the CustomTeamsList
CustomTeamsList.propTypes = {
  title: PropTypes.string.isRequired,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string,
      collaborator: PropTypes.string,
      interns: PropTypes.arrayOf(PropTypes.string),
      expirationDate: PropTypes.string,
    })
  ).isRequired,
};

export default CustomTeamsList;
