import React, { useEffect, useState } from 'react';
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import collaboratorTableData from "layouts/tables/data/collaboratorTableData";
import useCollaboratorStore from 'store/collaboratorStore';
import SoftPagination from "components/SoftPagination";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Backdrop } from '@mui/material';
import { DNA } from 'react-loader-spinner';

function Index() {
  const [visible, setVisible] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { collaborators, getCollaborators } = useCollaboratorStore((state) => ({
    collaborators: state.collaborators,
    getCollaborators: state.getCollaborators
  }));

  const totalCollaborators = collaborators.length;
  const totalPages = Math.ceil(totalCollaborators / itemsPerPage);

  useEffect(() => {
    getCollaborators();
    setLoading(false);
  }, [getCollaborators]);

  const calculatePaginationRange = () => {
    const totalDisplayedPages = 3;
    const halfRange = Math.floor(totalDisplayedPages / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage < totalDisplayedPages - 1) {
      startPage = Math.max(1, endPage - totalDisplayedPages + 1);
    }

    const paginationRange = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationRange.push(i);
    }

    return { startPage, endPage, paginationRange };
  };

  const { startPage, endPage, paginationRange } = calculatePaginationRange();

  const { columns, rows } = collaboratorTableData(
    collaborators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    setVisible,
    setSelectedCollaborator
  );

  useEffect(() => {
    if (selectedCollaborator) {
      setVisible(true);
    }
  }, [selectedCollaborator]);

  const handlePagination = (page) => {
    setCurrentPage(page);
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
                <SoftPagination size='small' variant="gradient">
                  <SoftPagination item onClick={() => handlePagination(currentPage - 1)} disabled={currentPage === 1}>
                    <Icon>keyboard_arrow_left</Icon>
                  </SoftPagination>
                  {startPage > 1 && (
                    <>
                      <SoftPagination item onClick={() => handlePagination(1)}>
                        1
                      </SoftPagination>
                      {startPage > 2 && <SoftTypography variant="button" fontWeight="medium" color="text">...</SoftTypography>}
                    </>
                  )}
                  {paginationRange.map((page) => (
                    <SoftPagination
                      key={page}
                      item
                      active={page === currentPage}
                      onClick={() => handlePagination(page)}
                    >
                      {page}
                    </SoftPagination>
                  ))}
                  {endPage < totalPages && (
                    <>
                      {endPage < totalPages - 1 && <SoftTypography variant="button" fontWeight="medium" color="text">...</SoftTypography>}
                      <SoftPagination item onClick={() => handlePagination(totalPages)}>
                        {totalPages}
                      </SoftPagination>
                    </>
                  )}
                  <SoftPagination item onClick={() => handlePagination(currentPage + 1)} disabled={currentPage === totalPages}>
                    <Icon>keyboard_arrow_right</Icon>
                  </SoftPagination>
                </SoftPagination>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
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
    </DashboardLayout>
  );
}

export default Index;
