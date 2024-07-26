import React, { useEffect, useState } from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import AddCollaborator from './addCollaborator';
import collaboratorTableData from "layouts/tables/data/collaboratorTableData";
import useCollaboratorStore from 'store/collaboratorStore';
import SoftPagination from "components/SoftPagination";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid'; // Import Grid component from Material-UI
import useValidationStore from 'store/useValidationStore ';

function Index() {
  const [visible, setVisible] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate();
  const collaborators = useCollaboratorStore((state) => state.collaborators);

  const getPaginatedCollaborators = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return collaborators.slice(start, end);
  };

  const { columns, rows } = collaboratorTableData(getPaginatedCollaborators(), setVisible, setSelectedCollaborator);

  useEffect(() => {
    if (selectedCollaborator) {
      setVisible(true);
    }
  }, [selectedCollaborator]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleStepperButtonClick = () => {
    navigate('/Collaborator/Create-Collaborator-Profile');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">Collaborator table</SoftTypography>
                <SoftButton variant="gradient" color="info" onClick={handleStepperButtonClick}>
                  <Icon sx={{ fontWeight: 'bold' }}>add</Icon>
                  &nbsp;add collaborator 
                </SoftButton>
                {/* <AddCollaborator
                  visible={visible}
                  setVisible={setVisible}
                  selectedCollaborator={selectedCollaborator}
                  setSelectedCollaborator={setSelectedCollaborator}
                /> */}
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
                <Table columns={columns} rows={rows} />
              </SoftBox>
              <SoftBox display="flex" justifyContent="center" p={2}>
                <SoftPagination variant="gradient">
                  <SoftPagination item onClick={() => handlePageChange(null, currentPage - 1)} disabled={currentPage === 1}>
                    <Icon>keyboard_arrow_left</Icon>
                  </SoftPagination>
                  {Array.from({ length: Math.ceil(collaborators.length / itemsPerPage) }).map((_, index) => (
                    <SoftPagination
                      key={index + 1}
                      item
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(null, index + 1)}
                    >
                      {index + 1}
                    </SoftPagination>
                  ))}
                  <SoftPagination item onClick={() => handlePageChange(null, currentPage + 1)} disabled={currentPage === Math.ceil(collaborators.length / itemsPerPage)}>
                    <Icon>keyboard_arrow_right</Icon>
                  </SoftPagination>
                </SoftPagination>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
}

export default Index;
