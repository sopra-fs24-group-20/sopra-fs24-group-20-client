import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Start from "../../views/Start";
import Register from "../../views/Register";
import {RegisterGuard} from "../routeProtectors/RegisterGuard"
import ProfilePage from "../../views/ProfilePage";
import {UserGuard} from "../routeProtectors/UserGuard";
import JoinLobby from "../../views/JoinLobby";
import { JoinLobbyGuard } from "../routeProtectors/JoinLobbyGuard";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/user/:id" element={<UserGuard />}>
          <Route path="/user/:id" element={<ProfilePage />} />
        </Route>

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/start" element={<Start/>} />

        <Route path="/register" element={<RegisterGuard />}>
          <Route path="/register" element={<Register/>} />
        </Route>

        <Route path="/joinlobby" element={<JoinLobbyGuard/>}>
          <Route path="/joinlobby" element={<JoinLobby/>} />
        </Route>

        <Route path="/" element={
          <Navigate to="/start" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
