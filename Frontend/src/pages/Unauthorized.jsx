import React from "react";
import { Link } from "react-router-dom";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

const Unauthorized = () => {
  return (
    <SoftBox textAlign="center" mt={5}>
      <SoftTypography variant="h4" fontWeight="bold">
        Unauthorized Access
      </SoftTypography>
      <SoftTypography variant="body1" mt={2}>
        You do not have permission to access this page.
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

export default Unauthorized;
