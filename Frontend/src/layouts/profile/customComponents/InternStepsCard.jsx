/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Card, CardContent, Box, Pagination, Grid } from "@mui/material";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import SoftTypography from "components/SoftTypography";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { keyframes } from "@mui/system";
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { getSubjectsHisotryByintern } from "Actions/SubjectActions";
import { useParams } from "react-router-dom";


const InternStepsCard = () => {
  const [data, setData] = useState([])
  const { id } = useParams()

  useEffect(() => {
    const loadData = async () => {
      const res = await getSubjectsHisotryByintern(id);
      setData(res);
    };
    loadData();
  }, [id]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const stepsPerPage = 2;

  const [currentPage, setCurrentPage] = useState({});
  const handlePagination = (subjectIndex, page) => {
    setCurrentPage((prev) => ({ ...prev, [subjectIndex]: page }));
  };
  const rotateAndScale = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`;


  const rotatingIconStyle = {
    animation: `${rotateAndScale} 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite`,
  };
  return (
    <Box sx={{ width: "100%", margin: "auto" }} p={2}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box>
            <SoftTypography variant="h5" color="dark" fontWeight="bold" textGradient>
              Progress Tracker
            </SoftTypography>
          </Box>
          <Box>
            <SoftTypography variant="subtitle2" color="secondary" textGradient>
              Track the progress across different subjects.
            </SoftTypography>
          </Box>
          <Box className="slider-container" p={2}>
            <Slider {...settings}>
              {data.map((subject, index) => {
                const totalSteps = subject.steps.length;
                const totalPages = Math.ceil(totalSteps / stepsPerPage);
                const current = currentPage[index] || 1;
                const startIndex = (current - 1) * stepsPerPage;
                const endIndex = Math.min(startIndex + stepsPerPage, totalSteps);
                const currentSteps = subject.steps.slice(startIndex, endIndex);
                const completedSteps = subject.steps.filter((s) => s.status === 'Completed').length;

                return (
                  <Box key={index} p={1}>
                    <Card sx={{ boxShadow: 1 }}>
                      <CardContent>
                        <Grid display="flex">
                          <SoftTypography variant="h5" color="dark" fontWeight="bold" textGradient>
                            {subject.title}
                          </SoftTypography>
                        </Grid>

                        <SoftTypography variant="caption" color="secondary" fontWeight="bold" textGradient mb={1}>
                          ({totalSteps} Steps | {completedSteps} Completed)
                        </SoftTypography>

                        {currentSteps.map((step, stepIndex) => (
                          <Box
                            key={stepIndex}
                            display="flex"
                            alignItems="center"
                            mb={1}
                          >
                            {step.status === "Completed" ? (
                              <CheckCircleOutlineRoundedIcon fontSize="medium" color="success" sx={{ marginRight: 1 }} />
                            ) : step.status === "Pending" ? (
                              <HourglassBottomRoundedIcon fontSize="medium" color="warning" sx={{ marginRight: 1, ...rotatingIconStyle }} />
                            ) : (
                              <PendingOutlinedIcon fontSize="medium" color="error" sx={{ marginRight: 1 }} />
                            )}
                            <Box>
                              <Box>
                                <SoftTypography variant="body2" color="primary" fontWeight="bold" textGradient>{step.description}</SoftTypography>
                              </Box>
                              <Box>
                                <SoftTypography variant="body2" color="secondary" textGradient>
                                  {step.status}
                                </SoftTypography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                        {totalPages > 0 && (
                          <Box display="flex" justifyContent="center" mt={2}>
                            <Pagination
                              size="small"
                              count={totalPages}
                              page={current}
                              variant="outlined"
                              onChange={(event, page) => handlePagination(index, page)}
                              color="info"
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Slider>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InternStepsCard;
