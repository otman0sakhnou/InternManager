import React from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import { Person as PersonIcon, Delete as DeleteIcon } from "@mui/icons-material";

const InternListItem = ({ intern, id, handleRemove }) => {

  return (
    <ListItem key={id} sx={{ pl: 0, backgroundColor: "red" }}>
      <PersonIcon className="h-8 w-8" />
      <ListItemText primary={intern.name} />
      <ListItemSecondaryAction>
        <Tooltip title="Remove Intern">
          <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(id)}>
            <DeleteIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

InternListItem.propTypes = {
  id: PropTypes.string.isRequired,
  intern: PropTypes.shape({
    // id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default InternListItem;
