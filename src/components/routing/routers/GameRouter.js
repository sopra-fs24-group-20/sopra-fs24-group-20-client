import React from "react";
import {Navigate, Route, Routes, useParams} from "react-router-dom";
import Game from "../../views/Game";
import PropTypes from "prop-types";
import ProfilePage from "../../views/ProfilePage";


const ProfilePageRoute = () => {
  const {username} = useParams();
  return <ProfilePage username={username} />
};

const GameRouter = () => {
  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      <Routes>

        <Route path="" element={<Game />} />

        <Route path="dashboard" element={<Game />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />

      </Routes>

    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
