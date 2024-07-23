import React, { useState } from "react";
import useStagiaireStore from "Admine/intern/InternStore";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";

// Fonction pour générer une couleur aléatoire
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Styles pour l'avatar
const avatarStyles = (backgroundColor) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor,
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
});

function PersonalInfos({ avatar, name, email, phone, gender, birthdate }) {
  // console.log("birthdate", birthdate);
  const backgroundColor = getRandomColor();
  return (
    <SoftBox display="flex" alignItems="center" px={1} py={0.5}>
      <SoftBox mr={2} style={avatarStyles(backgroundColor)}>
        {avatar.toUpperCase()}
      </SoftBox>
      <SoftBox display="flex" flexDirection="column">
        <SoftTypography variant="caption" color="secondary">
          <span style={{ fontWeight: "bold" }}>Full Name: </span>
          {name}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          <span style={{ fontWeight: "bold" }}>Email: </span>
          {email}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          <span style={{ fontWeight: "bold" }}>Phone:</span> {phone}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          <span style={{ fontWeight: "bold" }}>Gender:</span> {gender}
        </SoftTypography>
        <SoftTypography variant="caption" color="secondary">
          <span style={{ fontWeight: "bold" }}>Birthdate:</span>{" "}
          {dayjs(birthdate).format("YYYY-MM-DD")}
        </SoftTypography>
      </SoftBox>
    </SoftBox>
  );
}

function EducationInfos({ institution, level, specialization, yearOfStudy }) {
  return (
    <SoftBox display="flex" flexDirection="column" px={1} py={0.5}>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Institution:</span> {institution}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Level:</span> {level}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Specialization: </span>
        {specialization}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Year of Study:</span> {yearOfStudy}
      </SoftTypography>
    </SoftBox>
  );
}

function InternshipInfos({ title, department, startDate, endDate }) {
  // console.log("startDate", startDate);
  // console.log("endDate", endDate);
  return (
    <SoftBox display="flex" flexDirection="column" px={1} py={0.5}>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Title: </span>
        {title}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Department:</span> {department}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Start Date:</span>{" "}
        {dayjs(startDate).format("YYYY-MM-DD")}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>End Date:</span> {dayjs(endDate).format("YYYY-MM-DD")}
      </SoftTypography>
    </SoftBox>
  );
}

function AccountInfos({ username, password }) {
  return (
    <SoftBox display="flex" flexDirection="column" px={1} py={0.5}>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Username:</span> {username}
      </SoftTypography>
      <SoftTypography variant="caption" color="secondary">
        <span style={{ fontWeight: "bold" }}>Password:</span> {password}
      </SoftTypography>
    </SoftBox>
  );
}

function ActionIcons({ onEdit, onDelete }) {
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
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this intern?")) {
              onDelete();
            }
            handleClose();
          }}
        >
          <Tooltip title="Delete">
            <Icon sx={{ cursor: "pointer", color: "red", mr: 1 }} fontSize="small">
              delete
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
};

PersonalInfos.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  birthdate: PropTypes.string,
};

EducationInfos.propTypes = {
  institution: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  specialization: PropTypes.string.isRequired,
  yearOfStudy: PropTypes.string.isRequired,
};

InternshipInfos.propTypes = {
  title: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

AccountInfos.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

const InternsTableData = (paginatedInterns) => {
  const { deleteStagiaire } = useStagiaireStore();

  const handleDelete = (index) => {
    deleteStagiaire(index);
  };

  const columns = [
    { name: "PersonalInfos", align: "left" },
    { name: "EducationInfos", align: "left" },
    { name: "InternshipInfos", align: "left" },
    { name: "AccountInfos", align: "left" },
    { name: "Actions", align: "left" },
  ];

  const rows = (handleEditClick) =>
    paginatedInterns.map((stagiaire) => ({
      PersonalInfos: (
        <PersonalInfos
          avatar={stagiaire.avatar}
          name={stagiaire.name}
          email={stagiaire.email}
          phone={stagiaire.phone}
          gender={stagiaire.gender}
          birthdate={stagiaire.birthdate}
        />
      ),
      EducationInfos: (
        <EducationInfos
          institution={stagiaire.educationInfo.institution}
          level={stagiaire.educationInfo.level}
          specialization={stagiaire.educationInfo.specialization}
          yearOfStudy={stagiaire.educationInfo.yearOfStudy}
        />
      ),
      InternshipInfos: (
        <InternshipInfos
          title={stagiaire.internshipInfo.title}
          department={stagiaire.internshipInfo.department}
          startDate={stagiaire.internshipInfo.startDate}
          endDate={stagiaire.internshipInfo.endDate}
        />
      ),
      AccountInfos: (
        <AccountInfos
          username={stagiaire.accountInfo.username}
          password={stagiaire.accountInfo.password}
        />
      ),
      Actions: (
        <ActionIcons
          onEdit={() => handleEditClick(stagiaire)}
          onDelete={() => handleDelete(stagiaire.id)}
        />
      ),
    }));

  return { columns, rows };
};

export default InternsTableData;
