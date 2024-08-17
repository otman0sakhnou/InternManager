//
import { forwardRef } from "react";
import PropTypes from "prop-types";
import SoftTypography from "components/SoftTypography";
import SoftProgressRoot from "components/SoftProgress/SoftProgressRoot";

const SoftProgress = forwardRef(({ variant = "contained", color = "info", value = 0, label = false, ...rest }, ref) => (
  <div style={{ position: 'relative', width: '100%' }} >
    {label && (
      <SoftTypography
        variant="button"
        fontWeight="medium"
        color="text"
        style={{
          position: 'absolute',
          top: '-30px',
          right: '0',
          marginRight: '8px',
        }}
      >
        {value}%
      </SoftTypography>
    )}
    <SoftProgressRoot
      {...rest}
      ref={ref}
      variant="determinate"
      value={value}
      ownerState={{ color, value, variant }}
    />
  </div>
));

// Typechecking props for the SoftProgress
SoftProgress.propTypes = {
  variant: PropTypes.oneOf(["contained", "gradient"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  value: PropTypes.number,
  label: PropTypes.bool,
};

export default SoftProgress;
