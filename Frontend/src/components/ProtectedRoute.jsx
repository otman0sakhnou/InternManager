import React from "react";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";
import useAuthStore from "store/useAuthStore";

const ProtectedRoute = ({ element, roles, ...rest }) => {
  const { isAuthenticated, roles: userRoles } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    roles: state.roles, 
  }));

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" />;
  }

  const lowerCaseRoles = roles?.map((role) => role.toLowerCase());
  const lowerCaseUserRoles = userRoles?.map((role) => role.toLowerCase());

  if (roles && !lowerCaseRoles.some((role) => lowerCaseUserRoles.includes(role))) {
    console.log(roles && !lowerCaseRoles.some((role) => lowerCaseUserRoles.includes(role)));
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};


export default ProtectedRoute;
