import React, { useState } from "react";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import maleAvatar from "assets/avatars/male-avatar-maker-2a7919.webp";
import duration from "dayjs/plugin/duration";
import femaleAvatar from "assets/avatars/1e599ceb-ce32-4588-b931-f1dd33c99b37.jpg";
import SoftAvatar from "components/SoftAvatar";
import { useNavigate } from "react-router-dom";
// import neutralAvatar from "public/avatars/neutral.png";

dayjs.extend(duration);

// Fonction pour générer une couleur aléatoire
const getAvatarImage = (gender) => {
  switch (gender.toLowerCase()) {
    case "male":
      return maleAvatar;
    case "female":
      return femaleAvatar;
    default:
      return null;
  }
};
const avatarStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "#fff",
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
};

// Composants pour chaque section
function PersonalInfos({ name, gender }) {
  const avatarImage = getAvatarImage(gender);
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2} style={avatarStyles}>
        <SoftAvatar src={avatarImage} alt={name} size="sm" variant="rounded" />
      </SoftBox>
      <SoftTypography variant="button" fontWeight="medium">
        {name}
      </SoftTypography>
    </SoftBox>
  );
}

function ContactInfos({ email, phone }) {
  return (
    <SoftBox display="flex" flexDirection="column" px={1} py={0.5}>
      <SoftTypography variant="caption" color="secondary">
        {email}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        {phone}
      </SoftTypography>
    </SoftBox>
  );
}

function ActionIcons({ onEdit, onDelete, onViewDetails }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <SoftBox>
      <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={handleClick}>
        more_vert
      </Icon>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            onViewDetails();
            handleClose();
          }}
        >
          <Tooltip title="View Details">
            <Icon sx={{ cursor: "pointer", color: "#77E4C8", mr: 1 }} fontSize="small">
              info_outline
            </Icon>
          </Tooltip>
          View Details
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            onEdit();
            handleClose();
          }}
        >
          <Tooltip title="Edit">
            <Icon sx={{ cursor: "pointer", color: "blue", mr: 1 }} fontSize="small">
              edit
            </Icon>
          </Tooltip>
          Edit
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
        >
          <Tooltip title="Delete">
            <Icon sx={{ cursor: "pointer", color: "red", mr: 1 }} fontSize="small">
              delete_outline
            </Icon>
          </Tooltip>
          Delete
        </MenuItem>
      </Menu>
    </SoftBox>
  );
}

ActionIcons.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

PersonalInfos.propTypes = {
  name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
};

ContactInfos.propTypes = {
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
};

const InternsTableData = (paginatedInterns, handleDeleteClick, handleViewDetailsClick) => {
  const navigate = useNavigate();
  const handleViewDetails = (id) => {
    navigate(`/Intern/Profile/${id}`); // Navigate to the profile page with the user's ID
  };
  console.log(paginatedInterns);
  const columns = [
    { name: "Interns", align: "left" },
    { name: "Department", align: "left" },
    { name: "End Date", align: "left" },
    { name: "Duration", align: "left" },
    { name: "Contact", align: "left" },
    { name: "Actions", align: "left" },
  ];
  const getLatestPeriod = (periods) => {
    if (!periods || periods.length === 0) {
      return {}; // Retourne un objet vide si aucune période n'est disponible
    }
    return periods.reduce((latest, current) => {
      return dayjs(current.endDate).isAfter(dayjs(latest.endDate)) ? current : latest;
    }, periods[0]);
  };

  const rows = (handleEditClick) =>
    paginatedInterns.map((stagiaire) => {
      const latestPeriod = getLatestPeriod(stagiaire.periods);

      // Ajoutez une vérification pour afficher un message si latestPeriod est vide
      if (!latestPeriod || !latestPeriod.endDate) {
        return {
          Interns: <PersonalInfos name={stagiaire.name} gender={stagiaire.gender} />,
          Department: (
            <SoftTypography variant="caption" color="secondary">
              {stagiaire.department}
            </SoftTypography>
          ),
          "End Date": (
            <SoftTypography variant="caption" color="secondary">
              No End Date Available
            </SoftTypography>
          ),
          Duration: (
            <SoftTypography variant="caption" color="secondary">

            </SoftTypography>
          ),
          Contact: <ContactInfos email={stagiaire.user?.email} phone={stagiaire.phone} />,
          Actions: (
            <ActionIcons
              onEdit={() => handleEditClick(stagiaire)}
              onDelete={() => handleDeleteClick(stagiaire)}
              onViewDetails={() => handleViewDetails(stagiaire.id)}
            />
          ),
        };
      }

      return {
        Interns: (
          <PersonalInfos name={stagiaire.name} gender={stagiaire.gender} />
        ),
        Department: (
          <SoftTypography variant="caption" color="secondary">
            {stagiaire.department}
          </SoftTypography>
        ),
        "End Date": (
          <SoftTypography variant="caption" color="secondary">
            {dayjs(latestPeriod.endDate).format("YYYY-MM-DD")}
          </SoftTypography>
        ),
        Duration: (
          <SoftTypography variant="caption" color="secondary">
            {dayjs(latestPeriod.endDate).diff(
              dayjs(latestPeriod.startDate),
              "day"
            )}{" "}
            days
          </SoftTypography>
        ),
        Contact: <ContactInfos email={stagiaire.user?.email} phone={stagiaire.phone} />,
        Actions: (
          <ActionIcons
            onEdit={() => handleEditClick(stagiaire)}
            onDelete={() => handleDeleteClick(stagiaire)}
            onViewDetails={() => handleViewDetails(stagiaire.id)}
          />
        ),
      };
    });


  return { columns, rows };
};

export default InternsTableData;
