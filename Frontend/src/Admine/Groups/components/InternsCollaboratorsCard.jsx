import React, { useState } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  TextField,
  Button,
  Box,
  ListItemSecondaryAction,
  InputLabel
} from "@mui/material";
import { Edit, Save, Delete, Add } from "@mui/icons-material";
import StyledIcon from "components/StyledIcon";
import PropTypes from "prop-types";
import InternListItem from "./InternListItem";

const InternsCollaboratorsCard = ({
  interns,
  collaborators,
  selectedInterns,
  selectedCollaborator,
  onUpdateInterns,
  onUpdateCollaborator,
  getCollaboratorNameById
}) => {
  const [isEditingInterns, setIsEditingInterns] = useState(false);
  const [isEditingCollaborator, setIsEditingCollaborator] = useState(false);
  const [internsToAdd, setInternsToAdd] = useState([]);
  const [collaboratorToAdd, setCollaboratorToAdd] = useState("");

  const handleAddIntern = (intern) => {
    onUpdateInterns([...selectedInterns, intern]);
  };

  const handleRemoveIntern = (intern) => {
    onUpdateInterns(selectedInterns.filter((i) => i !== intern));
  };

  const handleSaveInterns = () => {
    setIsEditingInterns(false);
    // Additional save logic if needed
  };

  const handleAddCollaborator = () => {
    onUpdateCollaborator(collaboratorToAdd);
    setCollaboratorToAdd("");
  };

  const handleSaveCollaborator = () => {
    setIsEditingCollaborator(false);
    // Additional save logic if needed
  };

  return (
    <>
      {/* Interns Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Interns:
          </Typography>
          <IconButton
            color="info"
            onClick={() => {
              if (isEditingInterns) {
                handleSave();
              } else {
                setIsEditingInterns(true);
              }
            }}
          >
            {isEditingInterns ? <Save /> : <Edit />}
          </IconButton>
        </Box>
        <List>
          {selectedInterns.map((intern) => (
            <ListItem key={intern.id} sx={{ pl: 0 }}>
              <ListItemText primary={intern.name} />
              {isEditingInterns && (
                <ListItemSecondaryAction>
                  <Tooltip title="Remove Intern">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleSelectIntern(intern)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
          {isEditingInterns && (
            <>
              <Typography variant="body2" gutterBottom>
                Add Interns:
              </Typography>
              {console.log("*******")}
              {interns.map((intern, index) => (
                // <ListItem
                //   key={intern.id}
                //   button
                //   onClick={() => handleSelectIntern(intern)}
                //   selected={selectedInterns.includes(intern)}
                // >
                //   <ListItemText primary={intern.name} />
                // </ListItem>
                <InternListItem key={index}  id={index} intern={intern} handleRemove={handleRemoveIntern}/>
              ))}
            </>
          )}
        </List>
      </Box>

      {/* Collaborator Section */}
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Collaborator:
          </Typography>
          <IconButton
            color="info"
            onClick={() => {
              if (isEditingCollaborator) {
                handleSave();
              } else {
                setIsEditingCollaborator(true);
              }
            }}
          >
            {isEditingCollaborator ? <Save /> : <Edit />}
          </IconButton>
        </Box>
        {isEditingCollaborator ? (
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Collaborator</InputLabel>
            <Select
              value={selectedCollaborator}
              onChange={(e) => setSelectedCollaborator(e.target.value)}
              label="Collaborator"
            >
              {collaborators.map((collaborator) => (
                <MenuItem key={collaborator.id} value={collaborator.id}>
                  {collaborator.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2" gutterBottom>
            <strong>Collaborator:</strong> {getCollaboratorNameById(selectedCollaborator)}
          </Typography>
        )}
      </Box>
    </>
  );
};

InternsCollaboratorsCard.propTypes = {
  interns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  collaborators: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedInterns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCollaborator: PropTypes.string,
  onUpdateInterns: PropTypes.func.isRequired,
  onUpdateCollaborator: PropTypes.func.isRequired,
  getCollaboratorNameById: PropTypes.func.isRequired,
};

export default InternsCollaboratorsCard;

{/* <Grid item xs={12}>
  <Card>
    <SoftBox pt={2} px={2}>
      <InternsCollaboratorsCard
        interns={filteredStagiaires}
        collaborators={filteredCollaborators}
        selectedInterns={selectedInterns}
        selectedCollaborator={selectedCollaborator}
        onUpdateInterns={(updatedInterns) => setSelectedInterns(updatedInterns)}
        onUpdateCollaborator={(updatedCollaborator) => setSelectedCollaborator(updatedCollaborator)}
        getCollaboratorNameById={getCollaboratorNameById}
      />
    </SoftBox>
  </Card>
</Grid>; */}