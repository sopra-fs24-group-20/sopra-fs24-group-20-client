import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import PropTypes from "prop-types";
import { Lobby, User } from "types";

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
  const [lobby, setLobby] = useState<Lobby>(null);

  const exit = async () => {
    const local_username = localStorage.getItem("username");
    try {
      await api.put(`/lobby/leave`, JSON.stringify({lobbyName: lobby.lobbyName, username: local_username}) );
      navigate(`/user/${local_username}`);

    } catch (error) {
      alert(
        `Something went wrong during exiting the lobby: \n${handleError(error)}`
      );
      navigate(`/user/${local_username}`);
    }
  };
  const ready = async () => {
    try {
      await api.put("/player/${user.id}", JSON.stringify({ready: true}));

    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const players = await api.get(`/lobby/players`, lobby.lobbyName);
        setLobby(players.data);

      } catch (error) {
        alert("Something went wrong while fetching the lobby data.");
      }
    }

    fetchData();
  }, [lobby.lobbyName]);

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <h1 className="lobby title">{lobby.lobbyName}</h1>

            <ul className="lobby ul">
              {lobby.players.map((player: User) => (
                <li className="lobby li" key={player.id}>
                  <Player user={player}/>
                </li>
              ))}
            </ul>

            <div className="lobby ready">{lobby.players_ready}/{lobby.players.length} players are ready</div>
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
