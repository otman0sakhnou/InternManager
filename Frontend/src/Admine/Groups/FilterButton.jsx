import React from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";

const FilterButton = ({ label, isActive, onClick }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        flexShrink: 0, // Prevent buttons from shrinking
      }}
    >
      <Button
        onClick={onClick}
        variant={isActive ? "contained" : "outlined"}
        sx={{
          margin: { xs: "2px", sm: "5px", md: "8px" }, // Responsive margin
          borderRadius: "12px", // Rounded corners for a smoother look
          textTransform: "capitalize",
          fontWeight: isActive ? "bold" : "normal", // Bold text for active state
          backgroundColor: isActive ? "info.main" : "transparent", // Primary color for active
          color: isActive ? "#fff" : "#344767", // White text for active, primary color for inactive
          borderColor: "info.main", // Primary color for border
          "&:hover": {
            backgroundColor: isActive ? "info.dark" : "#e3f2fd", // Darker shade for active and light blue for inactive on hover
            borderColor: isActive ? "info.dark" : "#1976d2", // Border color change on hover
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

FilterButton.propTypes = {
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FilterButton;
