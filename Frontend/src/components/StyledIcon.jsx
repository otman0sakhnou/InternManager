import React from "react";
import Icon from "@mui/material/Icon";
import { styled } from "@mui/material/styles";

const StyledIcon = styled(Icon)(({ theme }) => ({
  fontWeight: "bold",
  color: "#3a416f", // Default color, can be overridden
}));

export default StyledIcon;
