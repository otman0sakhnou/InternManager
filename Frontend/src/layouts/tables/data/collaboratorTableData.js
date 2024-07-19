/* eslint-disable react/prop-types */
// Soft UI Dashboard React components
import { useState } from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import Icon from "@mui/material/Icon";
// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import team5 from "assets/images/team-5.jpg"; // Assuming you have more images
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
    fontSize: "16px", // adjust font size as needed
    fontWeight: "bold",
  };

  return (
    <SoftBox mr={2}>
      <div style={avatarStyle}>{initials.toUpperCase()}</div>
    </SoftBox>
  );
};

function Author({ image, name, email, phone }) {
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2}>
        <EmployeeAvatar name={name}/>
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

// const Action = () => (
//   <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
//     more_vert
//   </Icon>
// );

const Action = ({id, setVisible, setSelectedCollaborator, collaborator}) => {
  const deleteCollaborator = useCollaboratorStore((state) => state.deleteCollaborator)
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    handleClose();
    deleteCollaborator(id);  };

  const handleUpdate = () => {
    handleClose();
    setSelectedCollaborator(collaborator);
    setVisible(true);
  };

  return (
    <>
      <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={handleClick}>
        more_vert
      </Icon>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
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
      <Author
        image={collaborator.image}
        name={collaborator.name}
        email={collaborator.email}
        phone={collaborator.phone}
      />
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
    action: <Action id={collaborator.id} setVisible={setVisible} setSelectedCollaborator={setSelectedCollaborator} collaborator={collaborator} />,
  }));

  return { columns, rows };
};

export default collaboratorTableData;
