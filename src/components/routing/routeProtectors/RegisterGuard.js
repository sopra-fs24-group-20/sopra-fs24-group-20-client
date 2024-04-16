import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

export const RegisterGuard = () => {
  const username = localStorage.getItem("username");

  if (!username) {
    return <Outlet />;
  }

  return <Navigate to={`/user/${username}`} replace />;
};

RegisterGuard.propTypes = {
  children: PropTypes.node
};
