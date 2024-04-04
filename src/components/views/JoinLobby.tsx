import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one and the same file.
 */
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

  const JoinLobby = async () => {
    try {
      const requestBody = JSON.stringify({ LobbyName, LobbyPassword });
      const response = await api.post("/lobby/join", requestBody);
      if (response.status === 200){
        navigate("/game")
      }
      else if (response.status === 400){
        setError("Join lobby failed because password doesn't match")
      }
      else if (response.status === 404){
        setError("Join lobby failed because lobby doesn't exist")
      }

    }

    catch (error) {
      setError ("An error occurred while joining the lobby");
    }
  };

  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication form">
          <h1 className="authentication centered-text" >Join Lobby</h1>
          {error && <div className="authentication error-message">{error}</div>}
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
            onClick={() => JoinLobby()}
          >
            Join Lobby
          </Button>
        </div>
        <div>
          <a className="authentication link" href="/start">back</a>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default JoinLobby;
