import React, { useEffect, useState } from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import SoftBox from "../../components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "../../components/SoftTypography";
import Table from "../../examples/Tables/Table";

import InternsTableData from "layouts/tables/data/InternsTableData";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import SoftPagination from "components/SoftPagination";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "components/ConfirmationModals";
import CustomDropzone from "components/Dropzone";
import toast from "react-hot-toast";
import useStagiaireStore from "store/InternStore";
import { Grid, Backdrop } from "@mui/material";
import { DNA } from 'react-loader-spinner';

function Interns() {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const { addStagiaire, updateStagiaire, deleteAllStagiaires, deleteStagiaire } =
    useStagiaireStore();
  const stagiaires = useStagiaireStore((state) => state.stagiaires);
  const { loadInterns } = useStagiaireStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => { });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        await loadInterns();
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des stagiaires:", error);
        setLoading(false);
      }
    };

    fetchInterns();
  }, [loadInterns]);

  const getPaginatedInterns = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = stagiaires.slice(start, end);
    return paginated;
  };

  const handleAddIntern = (newIntern) => {

    if (selectedIntern) {
      setConfirmationModalDescription("Are you sure you want to edit this intern's information?");
      updateStagiaire(newIntern);
      toast.success("Intern updated successfully!");
    } else {
      navigate("/createintern");
    }
  };

  const handleEditClick = (intern) => {
    setSelectedIntern(intern);
  };

  const handleDeleteClick = (intern) => {
    setActionType("delete");
    setConfirmationModalTitle("Delete Intern");
    setConfirmationModalDescription(
      "Are you sure you want to delete this intern? This action cannot be undone."
    );
    setOnConfirmAction(() => async () => {
      setLoading(true);
      try {
        await deleteStagiaire(intern.id);
        toast.success("Intern deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete intern.");
      } finally {
        setLoading(false);
      }
    });
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteAllClick = () => {
    setActionType("delete");
    setConfirmationModalTitle("Delete Intern");
    setConfirmationModalDescription(
      "Are you sure you want to delete all interns? This action cannot be undone."
    );
    setOnConfirmAction(() => async () => {
      setLoading(true);
      try {
        await deleteAllStagiaires();
        toast.success("All interns deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete all interns.");
      } finally {
        setLoading(false);
      }
    });
    setIsConfirmationModalOpen(true);
  };


  const handleFileAdded = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const data = JSON.parse(text);
        for (const intern of data) {
          await addStagiaire(intern);
        }
        toast.success("Interns added successfully!");
      } catch (error) {
        toast.error("Error reading or parsing file.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };
  const handlePageChange = (value) => {
    setCurrentPage(value);
  };
  const handleViewDetailsClick = (intern) => {
    navigate(`/collaborator`);
  };
  const { columns, rows } = InternsTableData(
    getPaginatedInterns(),
    handleDeleteClick,
    handleViewDetailsClick
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={4}>
        <SoftBox md={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h6">Interns Table</SoftTypography>

              <SoftBox display="flex" justifyContent="flex-end" p={3}>
                <Grid container spacing={2} justifyContent="flex-end"> {/* Alignement des boutons à droite */}
                  <Grid item xs={12} sm="auto">
                    <SoftButton variant="gradient" color="info" onClick={handleAddIntern}>
                      <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                      Add Intern
                    </SoftButton>
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <SoftButton variant="gradient" color="error" onClick={handleDeleteAllClick}>
                      <Icon sx={{ fontWeight: "bold" }}>delete_sweep</Icon>
                      Delete All
                    </SoftButton>
                  </Grid>
                </Grid>
              </SoftBox>

            </SoftBox>
            <SoftBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: "1px solid #e0e0e0",
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows(handleEditClick)} />
            </SoftBox>
            <SoftBox display="flex" justifyContent="center" p={2}>
              <SoftPagination variant="gradient">
                <SoftPagination
                  item
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon>keyboard_arrow_left</Icon>
                </SoftPagination>
                {Array.from({ length: Math.ceil(stagiaires.length / itemsPerPage) }).map(
                  (_, index) => (
                    <SoftPagination
                      key={index + 1}
                      item
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </SoftPagination>
                  )
                )}
                <SoftPagination
                  item
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === Math.ceil(stagiaires.length / itemsPerPage)}
                >
                  <Icon>keyboard_arrow_right</Icon>
                </SoftPagination>
              </SoftPagination>
            </SoftBox>
          </Card>
          <SoftBox mt={2}>
            <Card>
              <SoftBox p={3}>
                <CustomDropzone onFileAdded={handleFileAdded} />
              </SoftBox>
            </Card>
          </SoftBox>
        </SoftBox>
      </SoftBox>

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
    </DashboardLayout>
  );
}

export default Interns;
