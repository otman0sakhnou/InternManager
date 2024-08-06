import React from 'react';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import SubjectList from './SubjectList';
import useSubjectStore from 'store/useSubjectStore';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ProjectsSection from 'layouts/profile/customComponents/ProjectsSection';

const SubjectPage = () => {
  const { subjects } = useSubjectStore();
  const { id } = useParams();

  const selectedSubject = subjects.find(subject => subject.id === id);

  return (
      <DashboardLayout>
        <Box>
          {selectedSubject ? (
            <SubjectList subjects={[selectedSubject]} />
          ) : (
            <ProjectsSection />
          )}
        </Box>
      </DashboardLayout>
  );
};

export default SubjectPage;
