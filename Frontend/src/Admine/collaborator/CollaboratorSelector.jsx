import React from "react";
import PropTypes from "prop-types";
import { Autocomplete, TextField, FormControl, FormLabel } from "@mui/material";

const CollaboratorSelector = ({ filteredCollaborators, selectedCollaborator, setSelectedCollaborator }) => {
  return (
    <FormControl fullWidth margin="normal">
    
      <Autocomplete
        value={filteredCollaborators.find((collaborator) => collaborator.id === selectedCollaborator) || null}
        onChange={(event, newValue) => setSelectedCollaborator(newValue?.id || "")}
        options={filteredCollaborators}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Select a collaborator"
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      />
    </FormControl>
  );
};

CollaboratorSelector.propTypes = {
  filteredCollaborators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCollaborator: PropTypes.string.isRequired,
  setSelectedCollaborator: PropTypes.func.isRequired,
};

export default CollaboratorSelector;
