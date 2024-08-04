/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import Icon from "@mui/material/Icon";
import ConfirmationModal from "../../../components/ConfirmationModals";
import { useNavigate } from "react-router-dom";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useCollaboratorStore from "store/collaboratorStore";

const getInitials = (name) => {
  const words = name.split(" ");
  if (words.length > 1) {
    return words[0][0] + words[1][0];
  } else {
    return words[0][0];
  }
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EmployeeAvatar = ({ name }) => {
  const initials = getInitials(name);
  const randomColor = getRandomColor();

  const avatarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundColor: randomColor,
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  };

  return (
    <SoftBox mr={2}>
      <div style={avatarStyle}>{initials.toUpperCase()}</div>
    </SoftBox>
  );
};

function Author({ name, email, phone }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <EmployeeAvatar name={name} />
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="button" fontWeight="medium">
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {email}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          {phone}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

const Action = ({ id, setVisible, setSelectedCollaborator, collaborator }) => {
  const navigate = useNavigate();
  const deleteCollaborator = useCollaboratorStore((state) => state.deleteCollaborator);
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
    handleClose();
  };

  const handleUpdate = () => {
    handleClose();
    setSelectedCollaborator(collaborator);
    setVisible(true);
  };
  const handleConfirmDelete = () => {
    deleteCollaborator(id);
    setConfirmOpen(false);
  };
  const handleViewDetails = () => {
    navigate(`/Collaborator/Profile/${collaborator.id}`); // Navigate to the profile page with the user's ID
    handleClose();
  };

  return (
    <>
      <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={handleClick}>
        more_vert
      </Icon>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleViewDetails}>
        <MenuItem>
          <Icon sx={{ cursor: "pointer", color: "#77E4C8", mr: 1 }} fontSize="small">
            info
          </Icon>
          details
        </MenuItem>
        <MenuItem onClick={handleUpdate}>
          {" "}
          <Icon sx={{ cursor: "pointer", color: "blue", mr: 1 }} fontSize="small">
            edit
          </Icon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Icon sx={{ cursor: "pointer", color: "red", mr: 1 }} fontSize="small">
            delete
          </Icon>
          Delete
        </MenuItem>
      </Menu>
      <ConfirmationModal
        open={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this collaborator?"
        onConfirm={handleConfirmDelete}
        actionType="delete"
      />
    </>
  );
};

function Function({ job, department, organization, mentorStatus }) {
  return (
    <SoftBox display="flex" flexDirection="column">
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {job} - {department}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        {organization}
      </SoftTypography>
    </SoftBox>
  );
}
const collaboratorTableData = (collaborators, setVisible, setSelectedCollaborator) => {
  const columns = [
    { name: "collaborator", align: "left" },
    { name: "function", align: "left" },
    { name: "status", align: "center" },
    { name: "employed", align: "center" },
    { name: "action", align: "center" },
  ];

  const rows = collaborators.map((collaborator) => ({
    collaborator: (
      <Author name={collaborator.name} email={collaborator.email} phone={collaborator.phone} />
    ),
    function: (
      <Function
        job={collaborator.job}
        department={collaborator.department}
        organization={collaborator.organization}
      />
    ),
    status: (
      <SoftBadge
        variant="gradient"
        badgeContent={collaborator.status}
        color={collaborator.status === "online" ? "success" : "error"}
        size="xs"
        container
      />
    ),
    employed: (
      <SoftTypography variant="caption" color="secondary" fontWeight="medium">
        {collaborator.employementDate}
      </SoftTypography>
    ),
    action: (
      <Action
        id={collaborator.id}
        setVisible={setVisible}
        setSelectedCollaborator={setSelectedCollaborator}
        collaborator={collaborator}
      />
    ),
  }));

  return { columns, rows };
};

export default collaboratorTableData;
