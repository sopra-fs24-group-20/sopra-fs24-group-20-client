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
  const [lobbyName, setLobbyName] = useState("");
  const [lobbyPassword, setLobbyPassword] = useState("");
  const [error, setError] = useState(null);

  const username = localStorage.getItem("username");

  const doCreateLobby = async () => {
    try {
      const requestBody = {
        lobbyName: lobbyName,
        lobbyPassword: lobbyPassword,
        ownerUsername: username,
      };
      console.log("first");
      const response = await api.post("/lobby/create", requestBody);
      console.log("second");
      if (response.status === 201) {
        const responseData = response.data;
        localStorage.setItem("lobbyName", lobbyName);
        navigate(`/lobby/${lobbyName}`);
      } else if (response.status === 400) {
        setError("Cannot create lobby, because lobby name already exists");
      }
    } catch (error) {
      console.log("unknown error")
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
            value={lobbyName}
            onChange={(name) => setLobbyName(name)}
          />
          <FormField
            label="Lobby Password"
            value={lobbyPassword}
            onChange={(password) => setLobbyPassword(password)}
          />
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
