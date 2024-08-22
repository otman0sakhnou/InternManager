import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <SoftBox textAlign="center" mt={5}>
      <SoftTypography variant="h4" fontWeight="bold">
        Something Went Wrong
      </SoftTypography>
      <SoftTypography variant="body1" mt={2}>
        An error occurred. Please try again later.
      </SoftTypography>
      <SoftBox mt={3}>
        <Link to="/dashboard">
          <SoftButton variant="gradient" color="info">
            Go to Dashboard
          </SoftButton>
        </Link>
      </SoftBox>
    </SoftBox>
  );
};

export default ErrorPage;
