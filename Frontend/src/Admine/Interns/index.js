import React, { useState } from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import SoftBox from "../../components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "../../components/SoftTypography";
import Table from "../../examples/Tables/Table";
import InternFormModal from "./InternFormModal";
import InternsTableData from "layouts/tables/data/InternsTableData";
import SoftButton from "components/SoftButton";
import Icon from "@mui/material/Icon";
import useStagiaireStore from "Admine/Interns/InternStore";
import SoftPagination from "components/SoftPagination";

import CustomDropzone from "components/Dropzone"; // Importer le composant Dropzone

function Interns() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const { addStagiaire, updateStagiaire, deleteAllStagiaires, stagiaires } = useStagiaireStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getPaginatedInterns = () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = stagiaires.slice(start, end);
    console.log("Paginated Interns:", paginated); // Ajoutez ce log pour déboguer
    return paginated;
  };
  const { columns, rows } = InternsTableData(getPaginatedInterns());
  const handleAddIntern = (newIntern) => {
    if (selectedIntern) {
      updateStagiaire(newIntern);
    } else {
      addStagiaire(newIntern);
    }
    setIsFormModalOpen(false);
  };

  const handleEditClick = (intern) => {
    setSelectedIntern(intern);
    setIsFormModalOpen(true);
  };
  const handleDeleteAllClick = () => {
    if (window.confirm("Are you sure you want to delete all interns?")) {
      deleteAllStagiaires();
    }
  };
  const generateAvatar = (name) => {
    // Extraire les premières lettres du nom complet
    if (!name) return "";
    const initiales = name
      .split(" ")
      .map((name) => name[0])
      .join("");
    return initiales;
  };

  const handleFileAdded = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Lire le contenu du fichier comme texte
        const text = e.target.result;

        // Analyser le texte comme JSON
        const data = JSON.parse(text);

        // Vérifier le contenu des données
        console.log("Parsed data:", data);

        // Traiter les données comme vous le souhaitez
        data.forEach((intern) => {
          // Générer l'avatar basé sur le nom complet
          if (intern.name) {
            intern.avatar = generateAvatar(intern.name);
          } else {
            intern.avatar = "DEFAULT";
          }

          // Ajouter le stagiaire avec l'avatar généré
          addStagiaire(intern);
        });
      } catch (error) {
        console.error("Error reading or parsing file:", error);
      }
    };
    reader.readAsText(file);
  };
  const handlePageChange = (value) => {
    setCurrentPage(value);
  };
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
                  <SoftButton
                    variant="gradient"
                    color="info"
                    onClick={() => setIsFormModalOpen(true)}
                  >
                    <Icon sx={{ fontWeight: "bold" }}>add</Icon>
                    Add Intern
                  </SoftButton>
                  <SoftButton
                    variant="gradient"
                    color="error"
                    onClick={handleDeleteAllClick}
                    sx={{ ml: 2 }} // Ajoute un espace à gauche du bouton
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
      <InternFormModal
        open={isFormModalOpen}
        onClose={() => {
          setSelectedIntern(null);
          setIsFormModalOpen(false);
        }}
        onAddIntern={handleAddIntern}
        intern={selectedIntern}
      />
    </DashboardLayout>
  );
}

export default Interns;
