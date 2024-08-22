import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import CreateProfile from "./Admine/collaborator/CreateProfile";
import Collaborator from "./Admine/collaborator";
import Interns from "./Admine/Interns";
import InternForm from "Admine/Interns/InternForm";
import AddSubjectComponent from "Admine/Subjects/AddSubjectComponent";
import SubjectPage from "Admine/Subjects/SubjectPage";

import Groups from "./Admine/Groups";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";

import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";

import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupDetails from "Admine/Groups/GroupDetails";
import Profile from "layouts/profile";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
    roles: ["admin", "manager", "collaborator", "intern"],
  },
  {
    type: "collapse",
    name: "Collaborator",
    key: "collaborator",
    route: "/collaborator",
    icon: <PersonIcon size="12px" />,
    component: <Collaborator />,
    noCollapse: true,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "CreateIntern",
    key: "c",
    route: "/createintern",
    component: <InternForm />,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "AddSubject",
    key: "c",
    route: "/Add-Subject/:id",
    component: <AddSubjectComponent />,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "subjects",
    key: "subjects",
    route: "/Subject/:id",
    component: <SubjectPage />,
    roles: ["admin", "manager", "collaborator", "intern"],
  },
  {
    type: "collapse",
    name: "Interns",
    key: "interns",
    route: "/interns",
    icon: <GroupIcon size="12px" />,
    component: <Interns />,
    noCollapse: true,
    roles: ["admin", "manager", "collaborator"],
  },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   route: "/tables",
  //   icon: <Office size="12px" />,
  //   component: <Tables />,
  //   noCollapse: true,
  // },

  {
    type: "collapse",
    name: "Interns Groups ",
    key: "internsgroups",
    route: "/internsgroups",
    icon: <PeopleAltIcon size="12px" />,
    component: <Groups />,
    noCollapse: true,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "Groups Details ",
    key: "groupdetails",
    route: "/groupdetails/:id",

    component: <GroupDetails />,
    roles: ["admin", "manager", "collaborator", "intern"],
  },

  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   route: "/billing",
  //   icon: <CreditCard size="12px" />,
  //   component: <Billing />,
  //   noCollapse: true,
  // },
  // {
  //   type: "collapse",
  //   name: "Virtual Reality",
  //   key: "virtual-reality",
  //   route: "/virtual-reality",
  //   icon: <Cube size="12px" />,
  //   component: <VirtualReality />,
  //   noCollapse: true,
  // },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
    roles: ["admin", "manager", "collaborator", "intern"],
  },
  {
    //type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   route: "/authentication/sign-up",
  //   icon: <SpaceShip size="12px" />,
  //   component: <SignUp />,
  //   noCollapse: true,
  // },
  {
    name: "CreateIntern",
    key: "c",
    route: "/createintern",
    component: <InternForm />,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "InternProfile",
    key: "InternProfile",
    route: "/Intern/Profile/:id",
    component: <Profile />,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    type: "collapse",
    name: "Account",
    key: "account",
    icon: <CreditCard size="12px" />,
    noCollapse: false,
  },
  {
    name: "CreateCollaboratorProfile",
    key: "CreateCollaboratorProfile",
    route: "/Collaborator/Create-Collaborator-Profile",
    component: <CreateProfile />,
    roles: ["admin", "manager", "collaborator"],
  },
  {
    name: "CollaboratorProfile",
    key: "CollaboratorProfile",
    route: "/Collaborator/Profile/:id",
    component: <Profile />,
    roles: ["admin", "manager", "collaborator"],
  },
];

export default routes;
