import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import webSocketService from "helpers/websocketContext";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

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

const JoinLobby = () => {
  const navigate = useNavigate();
  const [LobbyName, setLobbyName] = useState<string>(null);
  const [LobbyPassword, setLobbyPassword] = useState<string>(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const username = localStorage.getItem("username");

  const doJoinLobby = async () => {
    try {
      const requestBody = {
        lobbyName: LobbyName,
        lobbyPassword: LobbyPassword,
        username: username
      };
      setLoading(true);
      const response = await api.post("/lobby/join", requestBody);
      console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem("lobbyName", LobbyName);
        localStorage.setItem("lobbyId", response.data.lobbyId);
        console.log(response.data.game.id);

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
        navigate(`/lobby/${LobbyName}`);
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
          setError("Cannot join lobby because the game is not in SETUP mode.");
        
        } else if (error.response.status === 403) {
          // Handle CONFLICT error
          setError("Cannot join lobby because the lobby is full");
        }else {
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
          <h1 className="authentication centered-text">Join Lobby</h1>
          {error && (
            <div className="authentication error-message">{error}</div>
          )}
          <FormField
            label="Lobby Name"
            value={LobbyName}
            onChange={(name) => setLobbyName(name)}
          />
          <FormField
            label="Lobby Password"
            value={LobbyPassword}
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
            disabled={!LobbyName || !LobbyPassword}
            width="100%"
            onClick={() => doJoinLobby()}
          >
            Join Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default JoinLobby;
