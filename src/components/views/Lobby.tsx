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
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState<Lobby>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const exit = async () => {
    const local_id = localStorage.getItem("id");
    try {
      const response = await api.get(`/users/${local_id}`);
      await api.put(`/logout/${local_id}`);
      navigate(`/user/${local_id}`);
    } catch (error) {
      alert(
        `Something went wrong during exiting the lobby: \n${handleError(error)}`
      );
      navigate(`/user/${local_id}`);
    }
  };

  const ready = async () => {
    try {
      const requestBody = JSON.stringify({ready: true});
      await api.put("/player/${user.id}", requestBody);
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const players = await api.get(`/lobby/players`, lobby.lobbyName); ///// BRUDER WAS
        setLobby(players.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <h1 className="lobby title">test</h1>

            <ul className="lobby ul">
              {lobby.players.map((player: User) => (
                <li className="lobby li" key={player.id}>
                  <Player user={player}/>
                </li>
              ))}
            </ul>

            <div className="lobby ready">test</div>
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
