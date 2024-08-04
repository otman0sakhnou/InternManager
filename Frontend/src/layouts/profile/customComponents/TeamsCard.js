import React from 'react'
import ProfilesList from 'examples/Lists/ProfilesList';
// Data
import profilesListData from "layouts/profile/data/profilesListData";
import { Grid } from '@mui/material';
import teamsList from '../data/TeamsList';
import CustomTeamsList from './CustomTeamsList';
import useAuthStore from 'store/AuthStore';
const List = [];
//this component is to list team members for an internship and to list teams for a collaborator

const TeamsCard = () => {
  const role = useAuthStore((state) => state.role)
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
  return (
    <Grid item xs={12} xl={4}>
      <CustomTeamsList title={title} teams={teamsList} />
    </Grid>
  );
}

export default TeamsCard