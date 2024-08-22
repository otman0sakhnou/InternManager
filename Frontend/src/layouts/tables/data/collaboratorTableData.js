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
import femaleAvatar from "assets/avatars/1e599ceb-ce32-4588-b931-f1dd33c99b37.jpg";
import maleAvatar from "assets/avatars/male-avatar-maker-2a7919.webp";
import toast from "react-hot-toast";
import { Backdrop } from "@mui/material";
import { DNA } from "react-loader-spinner";
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

function Author({ name, email, phone, gender }) {
  const avatarImage = getAvatarImage(gender);
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2} style={avatarStyles}>
        <SoftAvatar src={avatarImage} alt={name} size="sm" variant="rounded" />
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
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleViewDetails = () => {
    navigate(`/Collaborator/Profile/${collaborator.id}`);
    handleClose();
  };

  const handleDelete = () => {
    setActionType("delete");
    setConfirmationModalTitle("Delete Collaborator");
    setConfirmationModalDescription("Are you sure you want to delete this collaborator?");
    setOnConfirmAction(() => async () => {
      setLoading(true);
      try {
        await deleteCollaborator(id);
        toast.success("Collaborator deleted successfully!");
      } catch (error) {
        toast.error(`Error deleting collaborator`);
      } finally {
        setLoading(false);
      }
    });
    setIsConfirmationModalOpen(true);
  };




  return (
    <>
      <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={handleClick}>
        more_vert
      </Icon>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <MenuItem onClick={() => {
          handleViewDetails();

        }}>
          <Icon sx={{ cursor: "pointer", color: "#77E4C8", mr: 1 }} fontSize="small">
            info_outline
          </Icon>
          details
        </MenuItem>
        <MenuItem onClick={() => {
          handleDelete();

        }}>
          <Icon sx={{ cursor: "pointer", color: "red", mr: 1 }} fontSize="small">
            delete_outline
          </Icon>
          Delete
        </MenuItem>
      </Menu>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        handleClose={() => setIsConfirmationModalOpen(false)}
        title={confirmationModalTitle}
        description={confirmationModalDescription}
        onConfirm={() => {
          onConfirmAction();
          setIsConfirmationModalOpen(false);
        }}
        actionType={actionType}
      />
      <Backdrop
        sx={{ color: "#ff4", backgroundImage: "linear-gradient(135deg, #ced4da  0%, #ebeff4 100%)", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <DNA
          visible={true}
          height="100"
          width="100"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper"
        />
      </Backdrop>
    </>
  );
};

function Function({ title, department, organization, mentorStatus }) {
  return (
    <SoftBox display="flex" flexDirection="column">
      <SoftTypography variant="caption" fontWeight="medium" color="text">
        {title} - {department}
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
      <Author
        name={collaborator.name}
        email={collaborator.user.email}
        phone={collaborator.phone}
        gender={collaborator.gender}
      />
    ),
    function: (
      <Function
        title={collaborator.title}
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
        {collaborator.employmentDate}
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
