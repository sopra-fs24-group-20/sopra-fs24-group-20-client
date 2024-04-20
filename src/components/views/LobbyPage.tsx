import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import WebSocket from 'ws';
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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:3000');
    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);


  const exit = async () => {
    try {
      await api.put("/lobby/leave", JSON.stringify({lobbyName: localLobbyName, username: local_username}) );
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
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };
  const players_ready = (players) => {
    return players.filter(player => player.ready).length;
  };

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await api.get("/lobby/players", JSON.stringify(localLobbyName));
        setPlayers(response.data);

        if (players_ready(response.data) === response.data.length) {
          await api.put(`/players/${local_username}`, JSON.stringify({ready: false}));
          navigate("/game");
        }
        console.log(response.data)
      } catch (error) {
        alert("Something went wrong while fetching the lobby data.");
        console.log(error)
      }
    }

    fetchPlayers();
  }, [localLobbyName]);

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
