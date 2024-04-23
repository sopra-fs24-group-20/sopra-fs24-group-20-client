import React, { useEffect, useState } from "react";
import { api, handleError, client } from "helpers/api";
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

  const doJoinLobby = async () => {
    try {
      const requestBody = {
        lobbyName: LobbyName,
        lobbyPassword: LobbyPassword,
        username: username
      };
      console.log(LobbyPassword);
      console.log(LobbyName);
      console.log(username);
      const response = await api.post("/lobby/join", requestBody);
      if (response.status === 200) {
        localStorage.setItem("lobbyName", LobbyName);
        console.log("lobbyname in storage")
        localStorage.setItem("lobbyId", response.data.id);
        console.log("lobbyid in storage")
        // localStorage.setItem("gameId", response.data.game.id);
        try {
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
        }
        console.log(response.data)
        console.log("gameid in storage")
        console.log(response.data.message)
        client.send("/topic/lobby_join", {}, "{}");
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
            onChange={(name) => setLobbyName(name)}
          />
          <FormField
            label="Lobby Password"
            value={LobbyPassword}
            onChange={(password) => setLobbyPassword(password)}
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
