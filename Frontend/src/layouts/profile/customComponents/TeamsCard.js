import React from 'react'
import PropTypes from "prop-types";
import { Grid } from '@mui/material';
// import teamsList from '../data/TeamsList';
import { useState } from 'react';
import { useEffect } from 'react';
import CustomTeamsList from './CustomTeamsList';
import useAuthStore from 'store/AuthStore';
import useGroupStore from 'store/GroupsStore';
//this component is to list team members for an internship and to list teams for a collaborator

const TeamsCard = ({ id, role, isViewingOwnProfile }) => {
  const getGroupsByCollaboratorId = useGroupStore((state) => state.fetchGroupsByCollaboratorId);

  const getGroupsByInternId = useGroupStore((state) => state.fetchGroupsByInternId);
  const [groups, setGroups] = useState([]);

  const getTitleByRole = (role) => {
    switch (role) {
      case "Collaborator":
        return "Teams under your responsibility";
      case "Intern":
        return "Teams you are part of";
      default:
        return "Teams";
    }
  };

  const title = getTitleByRole(role);

  const getGroupsByRole = async (role, id) => {
    if (role === "Intern") {
      const groups = await getGroupsByInternId(id);
      return groups || [];
    } else if (role === "Collaborator" || role === "Manager") {
      const groups = await getGroupsByCollaboratorId(id);
      return groups || [];
    } else {
      return [];
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      const result = await getGroupsByRole(role, id);
      setGroups(result);
    };

    fetchGroups();
  }, [role, id]);

  return (
    <Grid item xs={12} xl={4}>
      <CustomTeamsList title={title} teams={groups} />
    </Grid>
  );
};

TeamsCard.propTypes = {
  id: PropTypes.string.isRequired,
  role: PropTypes.oneOf(["Collaborator", "Intern", "Manager"]).isRequired,
  isViewingOwnProfile: PropTypes.bool.isRequired,
};
export default TeamsCard