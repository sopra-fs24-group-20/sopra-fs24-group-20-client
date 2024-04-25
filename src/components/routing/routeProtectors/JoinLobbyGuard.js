import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */
export const JoinLobbyGuard = () => {
  if (localStorage.getItem("username")) {

    return <Outlet />;
  }

  return <Navigate to="/start" replace />;
};

JoinLobbyGuard.propTypes = {
  children: PropTypes.node
}