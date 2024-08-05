import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
// import CollabProfile from "Admine/collaborator/CollabProfile";
import CreateProfile from './Admine/collaborator/CreateProfile';
import Collaborator from "./Admine/collaborator";
import Interns from "./Admine/Interns";
import InternForm from "Admine/Interns/InternForm";
import AddSubjectComponent from "Admine/Subjects/AddSubjectComponent";
import SubjectPage from "Admine/Subjects/SubjectPage";

import Groups from "./Admine/Groups";

// Soft UI Dashboard React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupDetails from "Admine/Groups/GroupDetails";
import Profile from "layouts/profile";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Collaborator",
    key: "collaborator",
    route: "/collaborator",
    icon: <PersonIcon size="12px" />,
    component: <Collaborator />,
    noCollapse: true,
  },
  {
    name: "CreateIntern",
    key: "c",
    route: "/createintern",
    component: <InternForm />,
  },
  {
    name: "AddSubject",
    key: "c",
    route: "/Add-Subject",
    component: <AddSubjectComponent />,
  },
  {
    name: "subjects",
    key: "subjects",
    route: "/Subjects",
    component: <SubjectPage />,
  },
  {
    type: "collapse",
    name: "Interns",
    key: "interns",
    route: "/interns",
    icon: <GroupIcon size="12px" />,
    component: <Interns />,
    noCollapse: true,
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
  },
  {
    name: "Groups Details ",
    key: "groupdetails",
    route: "/groupdetails/:id",

    component: <GroupDetails />,
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
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   route: "/authentication/sign-in",
  //   icon: <Document size="12px" />,
  //   component: <SignIn />,
  //   noCollapse: true,
  // },
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
  },
  {
    name: "InternProfile",
    key: "InternProfile",
    route: "/Intern/Profile/:id",
    component: <Profile />,
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
  },
  {
    name: "CollaboratorProfile",
    key: "CollaboratorProfile",
    route: "/Collaborator/Profile/:id",
    component: <Profile />,
  },
];

export default routes;
