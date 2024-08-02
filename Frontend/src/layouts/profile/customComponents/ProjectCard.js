import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined"; // Outlined icon
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined"; // Outlined view icon
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined"; // Outlined delete icon
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

// Styled components for additional customization
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.info.main,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
}));

const ContentContainer = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flex: 1,
  padding: 0,
  "&:last-child": {
    paddingBottom: 0,
  },
}));

// Main component definition
const ProjectCard = ({ name, title, viewRoute, onDelete }) => {
  return (
    <StyledCard>
      <IconContainer>
        <FolderOutlinedIcon style={{ fontSize: 40, color: "white" }} />
      </IconContainer>
      <ContentContainer>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
      </ContentContainer>
      <CardActions>
        <Tooltip title="View Project">
          <IconButton component={Link} to={viewRoute} color="info">
            <VisibilityOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Project">
          <IconButton onClick={onDelete} color="error">
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </StyledCard>
  );
};

// Prop type validation
ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  viewRoute: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectCard;
