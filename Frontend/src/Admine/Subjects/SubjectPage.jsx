import React from 'react';
import { Box } from '@mui/material';
import AddSubjectComponent from './AddSubjectComponent';
import SubjectList from './SubjectList';
import useSubjectStore from 'store/useSubjectStore';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
const SubjectPage = () => {
  const { subjects } = useSubjectStore();

  return (
    <DashboardLayout>
      <Box>
        {/* <AddSubjectComponent /> */}
        <SubjectList subjects={subjects} />
      </Box>
    </DashboardLayout>
  );
};

export default SubjectPage;
