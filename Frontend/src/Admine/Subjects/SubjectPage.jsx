import React, { useEffect, useState } from 'react';
import { Backdrop, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import SubjectList from './SubjectList';
import useSubjectStore from 'store/useSubjectStore';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import ProjectsSection from 'layouts/profile/customComponents/ProjectsSection';
import { DNA } from 'react-loader-spinner';

const SubjectPage = () => {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getSubject } = useSubjectStore((state) => ({
    getSubject: state.getSubject,
  }));

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (id) {
          const fetchedSubject = await getSubject(id);
          setSubject(fetchedSubject);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id, getSubject]);

  return (
    <DashboardLayout>
      <Box>
        {subject && (
          <SubjectList subjects={[subject]} />
        )}
      </Box>
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
};

export default SubjectPage;
