import React from "react";
import PropTypes from "prop-types";
import FilterButton from "./FilterButton";

const GroupFilter = ({ selectedDepartment, setSelectedDepartment, departments }) => {
  return (
    <div style={{ marginBottom: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {departments.map((dept) => (
        <FilterButton
          key={dept.value}
          label={dept.label}
          isActive={selectedDepartment === dept.value}
          onClick={() => setSelectedDepartment(dept.value)}
        />
      ))}
    </div>
  );
};

GroupFilter.propTypes = {
  selectedDepartment: PropTypes.string.isRequired,
  setSelectedDepartment: PropTypes.func.isRequired,
  departments: PropTypes.array.isRequired,
};

export default GroupFilter;
