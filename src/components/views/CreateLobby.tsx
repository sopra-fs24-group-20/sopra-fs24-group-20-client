import React, { useEffect, useState } from "react";
import { api, handleError, client } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import JoinLobby from "./JoinLobby";

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
/*
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function stompConnect() {
      try {
        if (!client["connected"]) {
          client.connect({}, function () {
            client.send("/app/connect", {}, JSON.stringify({ username: username }));
            client.subscribe("/topic/lobby_join", function (response) {
            });
          });
        }
      } catch (error) {
        console.error(`Something went wrong: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong! See the console for details.");
      }
    }
    stompConnect();
    // return a function to disconnect on unmount

    return function cleanup() {
      if (client && client["connected"]) {
        client.disconnect(function () {
          console.log("disconnected from stomp");
        });
      }
    };
  }, []);
*/
  const doJoinLobby = async () => {
    try {
      const requestBody = {
        lobbyName: lobbyName,
        lobbyPassword: lobbyPassword,
        username: username
      };

      const response = await api.post("/lobby/join", requestBody);
      console.log(response.data.game.id);
      console.log(response.data);
      if (response.status === 200) {
        localStorage.setItem("lobbyName", lobbyName);
        localStorage.setItem("lobbyId", response.data.lobbyId);
        localStorage.setItem("gameId", response.data.game.id.toString());
        console.log(localStorage.getItem("gameId"));
        localStorage.setItem("roundDuration", response.data.roundDuration);
        /*try {
          // Make a request to get the game ID
          const gameIdResponse = await api.get(`/${response.data.id}/gameId`);
          if (gameIdResponse.status === 200) {
            const gameId = gameIdResponse.data;
            localStorage.setItem("gameId", gameId);
            console.log("gameid in storage:", gameId);
          } else {
            console.error("Failed to retrieve game ID:", gameIdResponse.data);
          }
        } catch (error) {
          console.error("Error while retrieving game ID:", error);
        }*/
        //client.send("/topic/lobby_join", {}, "{}");
        navigate(`/lobby/${lobbyName}`);
      } else if (response.status === 400) {
        setError("Join lobby failed because password doesn't match");
      } else if (response.status === 404) {
        setError("Join lobby failed because lobby doesn't exist");
      }
    } catch (error) {
      setError("An error occurred while joining the lobby");
    }
  };

  const doCreateLobby = async () => {
    const createBody = {
      lobbyName: lobbyName,
      lobbyPassword: lobbyPassword,
      ownerUsername: username,
    };
    try {
      const create_response = await api.post("/lobby/create", createBody);
      if (create_response.status === 201) {
        await doJoinLobby();
      } else if (create_response.status === 400) {
        console.log("lobby already exists")
        const errorMessage = create_response.data.message;
        setError(errorMessage);
      }
    } catch (error) {
      console.log(error)
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
