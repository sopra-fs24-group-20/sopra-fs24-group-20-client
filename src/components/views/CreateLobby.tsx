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

const CreateLobby = () => {
  const navigate = useNavigate();
  const [LobbyName, setLobbyName] = useState<string>(null);
  const [LobbyPassword, setLobbyPassword] = useState<string>(null);
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");

  const doCreateLobby = async () => {
    try {
      const requestBody = JSON.stringify({ LobbyName, LobbyPassword });
      const response = await api.post("/lobby/create", requestBody);
      if (response.status === 201) {
        navigate(`/lobby/${LobbyName}`);
      } else if (response.status === 400) {
        setError("Create lobby failed because the lobby name already exists");
      }
    } catch (error) {
      setError("An error occurred while creating the lobby");
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate back using browser's history object
  };

  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication form">
          <h1 className="authentication centered-text">Create Lobby</h1>
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
            onClick={() => doCreateLobby()}
          >
            Create Lobby
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

export default CreateLobby;
