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
      <a href="#">{user.username}</a>
    </div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const LobbyPage = () => {
  const navigate = useNavigate();
  const [lobby, setLobby] = useState<Lobby[]>({});
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const localUsername = localStorage.getItem(("username"));
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
      await api.put("/lobby/leave", JSON.stringify({lobbyName: lobby.lobbyName, username: localUsername}) );
      navigate(`/user/${localUsername}`);

    } catch (error) {
      alert(
        `Something went wrong during exiting the lobby: \n${handleError(error)}`
      );
      navigate(`/user/${localUsername}`);
    }
  };
  const ready = async () => {
    try {
      await api.put("/player/${localUsername}", JSON.stringify({ready: true}));
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const players = await api.get("/lobby/players", JSON.stringify(localLobbyName));
        setLobby(players.data);
        console.log(players.data);

      } catch (error) {
        alert("Something went wrong while fetching the lobby data.");
        console.log(lobby)
      }
    }

    fetchData();
  }, [localLobbyName]);

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <h1 className="lobby title">{localLobbyName}</h1>

            <ul className="lobby ul">
                <li className="lobby li">players</li>
            </ul>

            <div className="lobby ready">
              players are ready
            </div>

            <Button
              className="secondary-button"
              width="60%"
              onClick={ready}
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
