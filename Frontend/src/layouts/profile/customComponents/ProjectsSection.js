import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

import Card from "@mui/material/Card";
import { Grid, Icon } from '@mui/material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import PlaceholderCard from "examples/Cards/PlaceholderCard";
import ProjectCard from './ProjectCard';
import SoftPagination from 'components/SoftPagination';
import useSubjectStore from 'store/useSubjectStore';
import toast from 'react-hot-toast';
import ConfirmationModal from 'components/ConfirmationModals';

const ProjectsSection = ({ subjects = [], onRefresh }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalTitle, setConfirmationModalTitle] = useState('');
  const [confirmationModalDescription, setConfirmationModalDescription] = useState('');
  const [subjectIdToDelete, setSubjectIdToDelete] = useState(null);
  const itemsPerPage = 2;
  const removeSubject = useSubjectStore(state => state.removeSubject);

  const addSubject = () => {
    navigate(`/Add-Subject/${id}`);
  };
  const totalPages = Math.ceil(subjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubjects = subjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePagination = (page) => {
    setCurrentPage(page);
  };

  const paginationRange = [...Array(totalPages).keys()].map((x) => x + 1);


  const openDeleteConfirmation = (subjectId) => {
    setSubjectIdToDelete(subjectId);
    setConfirmationModalTitle('Delete Subject');
    setConfirmationModalDescription('Are you sure you want to delete this subject? This action cannot be undone.');
    setIsConfirmationModalOpen(true);
  };

  const deleteSubject = async (subjectId) => {
    setLoading(true);
    try {
      await removeSubject(subjectId);
      toast.success("Subject deleted successfully");
      if (onRefresh) onRefresh();
      if (currentSubjects.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      toast.error("Error deleting subject");
      console.error("Error deleting:", error);
    } finally {
      setIsConfirmationModalOpen(false);
      setLoading(false);
    }
  };
  const onConfirmAction = () => {
    if (subjectIdToDelete) {
      deleteSubject(subjectIdToDelete);
    }
  };

  return (
    <Card sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
      <SoftBox pt={2} px={2}>
        <SoftBox mb={0.5} display="flex" alignItems="center" justifyContent="space-between">
          <SoftTypography variant="h6" fontWeight="medium">
            Subjects
          </SoftTypography>
        </SoftBox>
      </SoftBox>

      <SoftBox p={2}>
        <Grid container spacing={0.5}>
          {currentSubjects && currentSubjects.length > 0 ? (currentSubjects.map((subject) => (
            <Grid
              key={subject.id}
              item
              xs={12}
              mx={1}
            >
              <ProjectCard subject={subject} onDelete={() => openDeleteConfirmation(subject.id)} />
            </Grid>
          ))) :
            (<Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
              <SoftBox mb={0.5} textAlign="center">
                <SoftTypography variant="h6" fontWeight="bold" color="secondary" textGradient>
                  No subjects available
                </SoftTypography>
              </SoftBox>
            </Grid>
            )}
          {totalPages > 1 && (
            <Grid item xs={12} display="flex" justifyContent="center">
              <SoftPagination size="small" variant="gradient" color="primary">
                <SoftPagination
                  item
                  onClick={() => handlePagination(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <Icon>keyboard_arrow_left</Icon>
                </SoftPagination>
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
                <SoftPagination
                  item
                  onClick={() => handlePagination(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <Icon>keyboard_arrow_right</Icon>
                </SoftPagination>
              </SoftPagination>
            </Grid>
          )}
          <Grid
            onClick={addSubject}
            item
            xs={12}
            sx={{

              marginTop: '4%',
              cursor: 'pointer',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <PlaceholderCard title={{ variant: "h6", text: "New Subject" }} outlined />
          </Grid>
        </Grid>
      </SoftBox>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        handleClose={() => setIsConfirmationModalOpen(false)}
        title={confirmationModalTitle}
        description={confirmationModalDescription}
        onConfirm={onConfirmAction}
        actionType="delete"
      />
    </Card>
  );
};

ProjectsSection.propTypes = {
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
  onRefresh: PropTypes.func,
};

export default ProjectsSection;
