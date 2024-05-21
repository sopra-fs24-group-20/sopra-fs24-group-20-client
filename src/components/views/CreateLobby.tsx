import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
import webSocketService from "helpers/websocketContext";

const FormField = (props) => {
  return (
    <div className="authentication field">
      <label className="authentication label">{props.label}</label>
      <input
        className="authentication input"
        placeholder="enter here.."
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const CreateLobby = () => {
  const navigate = useNavigate();
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const username = localStorage.getItem("username");

  const doJoinLobby = async () => {
    try {
      const requestBody = {
        lobbyName: lobbyName,
        lobbyPassword: lobbyPassword,
        username: username
      };
      setLoading(true);
      const response = await api.post("/lobby/join", requestBody);
      console.log(response.data.game.id);
      console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem("lobbyName", lobbyName);
        localStorage.setItem("lobbyId", response.data.lobbyId);
        console.log(localStorage.getItem("gameId"));
        const categories = {categories: ["country", "city", "profession", "celebrity"]};
        JSON.stringify(categories);
        await api.put(`/lobby/settings/${localStorage.getItem("lobbyId")}`, categories);
        // establish websocket connection when joining lobby
        webSocketService.connect();
        // wait until actually connected to websocket
        await new Promise<void>((resolve) => { 
          const interval = setInterval(() => {
            if (webSocketService.connected) {
              clearInterval(interval);
              resolve(); 
            }
          }, 100);
        });
        await webSocketService.sendMessage("/app/join", { username: username , lobbyId: response.data.lobbyId});
        navigate(`/lobby/${lobbyName}`);
      } 
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          // Handle BAD REQUEST error
          setError("Join lobby failed because password doesn’t match");
        } else if (error.response.status === 404) {
          // Handle NOT FOUND error
          setError("Join lobby failed because the lobby doesn’t exist");
        } else if (error.response.status === 409) {
          // Handle CONFLICT error
          setError("Cannot join lobby as the game is not in SETUP mode.");
        } else {
          // Handle other errors
          setError("An error occurred while joining the lobby. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setError("No response received from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const doCreateLobby = async () => {
    const createBody = {
      lobbyName: lobbyName,
      lobbyPassword: lobbyPassword,
      ownerUsername: username,
    };
    try {
      setLoading(true);
      const create_response = await api.post("/lobby/create", createBody);
      if (create_response.status === 201) {
        await doJoinLobby();
      } 
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code 
        if (error.response.status === 400) {
          // Handle BAD REQUEST error
          setError("Lobby name must not be empty.");
        } else if (error.response.status === 404) {
          // Handle NOT FOUND error
          setError("Player not found.");
        } else if (error.response.status === 500) {
          // Handle INTERNAL SERVER ERROR
          setError("An internal server error occurred while creating the lobby.");
        } else if (error.response.status ===409){
          setError("Cannot create lobby because it already exists.")
        } else {
          // Handle other errors
          setError("An error occurred while creating the lobby.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setError("No response received from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate back using browser's history object
  };

  if (loading) {
    return (
      <BaseContainer>
        <div className="authentication container">
          <div className="authentication form">
            <CategoriesLoadingScreen />
          </div>
        </div>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication form">
        <div className="authentication back-arrow">
          <Button
              className="secondary-button"
              width="fit-content"
              onClick={() => goBack()}
            >
              Back
            </Button>
        </div>
          <h1 className="authentication centered-text">Create Lobby</h1>
          {error && (
            <div className="authentication error-message">{error}</div>
          )}
          <FormField
            label="Lobby Name"
            value={lobbyName}
            onChange={(name) => setLobbyName(name)}
          />
          <FormField
            label="Lobby Password"
            value={lobbyPassword}
            onChange={(password) => setLobbyPassword(password)}
            type={showPassword ? "text" : "password"}
          />
          <div className="authentication checkbox-container">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="authentication checkbox-label">Show Password</label>
          </div>
        </div>
        <div className="authentication button-container">
          <Button
            disabled={!lobbyName || !lobbyPassword}
            width="100%"
            onClick={() => doCreateLobby()}
          >
            Create Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default CreateLobby;
