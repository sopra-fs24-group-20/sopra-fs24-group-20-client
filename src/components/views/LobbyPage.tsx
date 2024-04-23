import React, { useEffect, useState } from "react";
import { api, handleError, client } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import PropTypes from "prop-types";
import { Lobby } from "types";

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">
      {user.username}
    </div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const LobbyPage = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const local_username = localStorage.getItem("username");
  const [readyButtonClicked, setButtonClicked] = useState(false);
  const localLobbyId = localStorage.getItem(("lobbyId"))
  const [ready_ws, setReadyWS] = useState(null);

  useEffect(() => {
    fetchPlayers();
    async function stompConnect() {
      try {
        if (!client["connected"]) {
          client.connect({}, function () {
            client.send("/app/connect", {}, JSON.stringify({ username: local_username }));
            client.send("/topic/join", {}, "{}");
            client.subscribe("/topic/ready-count", function (response) {
              fetchPlayers();
              const data = JSON.parse(response.body);
              setReadyWS(data);
            });
            client.subscribe("/topic/lobby_join", function (response) {
              const data = JSON.parse(response.body);
              if (data.command === "new-join") {
                fetchPlayers();
              }
              console.log(data.body);
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
  }, []);

  const exit = async () => {
    try {
      await api.put(`/lobby/leave/${localLobbyId}?username=${local_username}`);
      navigate(`/profile/${local_username}`);
    } catch (error) {
      alert(
        `Something went wrong during exiting the lobby: \n${handleError(error)}`
      );
    }
  };
  const local_ready = async () => {
    try {
      await api.put(`/players/${local_username}`, JSON.stringify({ready: true}));
      setButtonClicked(true);
      client.send("/app/ready-up", {}, JSON.stringify({ username: local_username }));
      console.log("ws ready send");
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };
  const players_ready = (players) => {
    return players.filter(player => player.ready).length;
  };


  async function fetchPlayers() {
    try {
      console.log("HELLOOOOOOO")
      const response = await api.get("/lobby/players", JSON.stringify(localLobbyName));
      setPlayers(response.data);

      if (players_ready(response.data) === response.data.length) {
        // before leaving the lobby page, disconnect ws
        if (client && client["connected"]) {
          client.disconnect(function () {
            console.log("disconnected from stomp");
          });
        }
        navigate(`/game/${localLobbyName}`);
      }
      console.log(response.data)
    } catch (error) {
      alert("Something went wrong while fetching the lobby data.");
      console.log(error)
    }
  }


  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <h1 className="lobby title">{localLobbyName}</h1>

            <ul className="lobby ul">
              {players.map((player, index) => (
                <li key={index} className="lobby li">
                  <Player user={player} />
                </li>
              ))}
            </ul>

            <div className="lobby ready">
              {players_ready(players)}/{players.length} players are ready
            </div>

            <Button
              className="secondary-button"
              width="60%"
              onClick={local_ready}
              disabled={readyButtonClicked}
            >
              ready
            </Button>

            <div>
              <a className="lobby link" href="#" onClick={exit}>exit</a>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyPage;
