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
import ConfirmationModal from "components/ConfirmatonModal";
import CustomDropzone from "components/Dropzone";
import toast from "react-hot-toast";
import useStagiaireStore from "store/InternStore";

function Interns() {
  const [selectedIntern, setSelectedIntern] = useState(null);
  const { addStagiaire, updateStagiaire, deleteAllStagiaires, deleteStagiaire } =
    useStagiaireStore();
  const stagiaires = useStagiaireStore((state) => state.stagiaires);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [confirmationModalTitle, setConfirmationModalTitle] = useState("");
  const [confirmationModalDescription, setConfirmationModalDescription] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(() => () => {});
  const navigate = useNavigate();

  useEffect(() => {

  }, [stagiaires])

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
    setOnConfirmAction(() => () => {
      deleteStagiaire(intern.id);
      toast.success("Intern deleted successfully!");
    });
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteAllClick = () => {
    setActionType("delete");
    setConfirmationModalTitle("Delete Intern");
    setConfirmationModalDescription(
      "Are you sure you want to delete all interns? This action cannot be undone."
    );
    setOnConfirmAction(() => () => {
      deleteAllStagiaires();
      toast.success("All interns deleted successfully!");
    });
    setIsConfirmationModalOpen(true);
  };

  const handleFileAdded = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const data = JSON.parse(text);
        //console.log("Parsed data:", data);
        data.forEach((intern) => {
          // Générer l'avatar basé sur le nom complet
          // if (intern.name) {
          //   intern.avatar = generateAvatar(intern.name);
          // } else {
          //   intern.avatar = "DEFAULT";
          // }
          // Ajouter le stagiaire avec l'avatar généré
          addStagiaire(intern);
        });
      } catch (error) {
        //console.error("Error reading or parsing file:", error);
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

              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftBox>
                  <SoftButton variant="gradient" color="info" onClick={handleAddIntern}>
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    Add Intern
                  </SoftButton>
                  <SoftButton
                    variant="gradient"
                    color="error"
                    onClick={handleDeleteAllClick}
                    sx={{ ml: 2 }}
                  >
                    <Icon sx={{ fontWeight: "bold" }}>delete_sweep</Icon>
                    Delete All
                  </SoftButton>
                </SoftBox>
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
    </DashboardLayout>
  );
}

export default Interns;
