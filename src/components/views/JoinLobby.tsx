import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="authentication field">
      <label className="authentication label">{props.label}</label>
      <input
        className="authentication input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const JoinLobby = () => {
  const navigate = useNavigate();
  const [LobbyName, setLobbyName] = useState<string>(null);
  const [LobbyPassword, setLobbyPassword] = useState<string>(null);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");

  const doJoinLobby = async () => {
    try {
      console.log("")
      const requestBody = JSON.stringify({
        lobbyName: LobbyName,
        lobbyPassword: LobbyPassword,
        username: username
      });
      const response = await api.post("/lobby/join", requestBody);
      if (response.status === 200) {
        localStorage.setItem("lobbyName", LobbyName);
        navigate(`/lobby/${LobbyName}`);
      } else if (response.status === 400) {
        setError("Join lobby failed because password doesn't match");
      } else if (response.status === 404) {
        setError("Join lobby failed because lobby doesn't exist");
      }
    } catch (error) {
      setError("An error occurred while joining the lobby");
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate back using browser's history object
  };

  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication form">
          <h1 className="authentication centered-text">Join Lobby</h1>
          {error && (
            <div className="authentication error-message">{error}</div>
          )}
          <FormField
            label="Lobby Name"
            value={LobbyName}
            onChange={(name: string) => setLobbyName(name)}
          />
          <FormField
            label="Lobby Password"
            value={LobbyPassword}
            onChange={(password: string) => setLobbyPassword(password)}
          />
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
        <div>
          <a className="authentication link" href="#" onClick={goBack}>
            Back
          </a>
        </div>
      </div>
    </BaseContainer>
  );
};

export default JoinLobby;
