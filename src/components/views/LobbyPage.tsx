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
  const [new_join, setNewJoinWS] = useState(null);
  const [reload, setReload] = useState(null);
  const ws = localStorage.getItem("readyws");




  useEffect(() => {
    async function stompConnect() {
      try {
        console.log("vor fetch players");
        await fetchPlayers();
        //await new Promise((resolve) => setTimeout(resolve, 1000));
        //await new Promise((resolve) => client.connect({}, resolve));
        client.connect({}, function () {
          client.send("/app/connect", {}, JSON.stringify({ username: local_username }));
          console.log("CONNECTED");
          client.send("/topic/refresh", {}, "{}");
          client.subscribe("/topic/ready-count", function (response) {
            const data = JSON.parse(response.body);
            fetchPlayers();
            window.location.reload();
            setReadyWS(data.command);
            console.log(data.command);
            if (data.command === "start"){
              start_game();
            }
          });
          client.subscribe("/topic/lobby-refresh", function (response) {
            const data = JSON.parse(response.body);
            if (data.command === "refresh") {
              setNewJoinWS(data);
              fetchPlayers();
              window.location.reload();
            }
          });
        });
      } catch (error) {
        alert(
          `Something went wrong during connecting to the websocket: \n${handleError(error)}`
        );
      }
    }
    stompConnect();

  }, [local_username]);


  useEffect(() => {
    new Promise((resolve) => setTimeout(resolve, 1000));
    if (ws === "false") {
      console.log(ws);
      window.location.reload();
      localStorage.setItem("readyws", JSON.stringify(true));
      console.log(ws);
    }
  }, [ws]);


  const exit = async () => {
    try {
      await api.put(`/lobby/leave/${localLobbyId}?username=${local_username}`);
      client.send("/topic/refresh", {}, "{}");
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("roundDuration");
      localStorage.removeItem("gamews");
      localStorage.removeItem("readyws");
      navigate(`/user/${local_username}`);
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
      client.send("/app/ready-up", {}, JSON.stringify({ username: local_username, lobbyId:localLobbyId }));
    } catch (error) {
      alert(
        `Something went wrong while getting ready: \n${handleError(error)}`
      );
    }
  };
  const players_ready = (players) => {
    return players.filter(player => player.ready).length;
  };
  const start_game = async () => {
    try {
      // before leaving the lobby page, disconnect ws
      if (client && client["connected"]) {
        client.disconnect(function () {
          console.log("disconnected from stomp");
        });
      }
      navigate(`/game/${localLobbyName}`);
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };
  const fetchPlayers = async () => {
    try {
      const response = await api.get(`/lobby/players/${localLobbyId}`);
      setPlayers(response.data);
    } catch (error) {
      alert(
        `Something went wrong while fetching player data: \n${handleError(error)}`
      );
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
