import React from 'react'
import PropTypes from "prop-types"; 
import { Grid } from '@mui/material';
// import teamsList from '../data/TeamsList';
import CustomTeamsList from './CustomTeamsList';
import useAuthStore from 'store/AuthStore';
import useGroupStore from 'store/GroupsStore';
//this component is to list team members for an internship and to list teams for a collaborator

const TeamsCard = (id) => {
  const role = useAuthStore((state) => state.role)
  const getGroupsByCollaboratorId = useGroupStore((state) => state.getGroupsByCollaboratorId)

  const getGroupsByInternId = useGroupStore((state) => state.getGroupsByInternId);

  const getTitleByRole = (role) => {
    switch (role) {
      case 'collaborator':
        return 'Teams under your responsibility';
      case 'intern':
        return 'Teams you are part of';
      default:
        return 'Teams';
    }
  };

  const title = getTitleByRole(role);

  const getGroupsByRole = (role, id) => {
    if (role === "intern") {
      return getGroupsByInternId(id);
    } else if (role === "collaborator") {
      return getGroupsByCollaboratorId(id);
    } else {
      return [];
    }
  };

  const groups = getGroupsByRole(role, id);

  return (
    <Grid item xs={12} xl={4}>
      <CustomTeamsList title={title} teams={groups} />
    </Grid>
  );
}

TeamsCard.propTypes={
  id: PropTypes.string.isRequired,
}  
export default TeamsCard