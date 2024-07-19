import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import AddCollaborator from './addCollaborator';
//Data
import collaboratorTableData from "layouts/tables/data/collaboratorTableData";
import useCollaboratorStore from 'store/collaboratorStore';

const collaborators1 = [
  {
    name: "John Michael",
    email: "john@creative-tim.com",
    phone: "+1234567890",
    job: "Collaborator",
    department: "Microsoft",
    organization: "SQLI",
    status: "online",
    employementDate: "23/04/18",
  },
  {
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    phone: "+1234567891",
    job: "Collaborator",
    department: "JAVA",
    organization: "Company B",
    status: "offline",
    employementDate: "11/01/19",
  },
  // ... add more collaborators as needed
];

function index() {
  const [visible, setVisible] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const collaborators = useCollaboratorStore((state) => state.collaborators);
  const { columns, rows } = collaboratorTableData(collaborators, setVisible, setSelectedCollaborator);
  console.log(collaborators);

  useEffect(() => {
    if (selectedCollaborator) {
      setVisible(true);
    }
  }, [selectedCollaborator]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4}>
        <SoftBox md={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Collaborator table</SoftTypography>
              <AddCollaborator visible={visible} setVisible={setVisible} selectedCollaborator={selectedCollaborator} setSelectedCollaborator={setSelectedCollaborator} />
            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows}  />
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  )
}

export default index