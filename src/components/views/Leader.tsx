import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";

const Player = ({ user, index }) => {
  const change = [
    <span key="up" style={{ color: "green"}}>↑</span>,
    <span key="down" style={{ color: "red" }}>↓</span>
  ];

  return (
    <div className="player-row">
      <div className="player-col">
        {index + 1}.
      </div>
      <div className="player-col2">
        {user.username}
      </div>
      <div className="player-col">
        {user.points}pt
      </div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
};

const Leader = () => {
  const navigate = useNavigate();
  const [playersPoints, setPlayersPoints] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);

  const localLobbyName = localStorage.getItem(("lobbyName"));
  const localUsername = localStorage.getItem("username");
  const localLobbyId = localStorage.getItem(("lobbyId"));
  const localGameId = localStorage.getItem("gameId");

  const [readyButtonClicked, setButtonClicked] = useState(false);
  //const mockplayers = { "barbara": 30 , "paul": 25, "glory":20,"joshi":35 };
  /*const sortedMOCKPlayers: { username: string; points: number }[] = Object.entries(mockplayers)
    .map(([username, points]: [string, number]) => ({ username, points }))
    .sort((a, b) => b.points - a.points);
*/

  useEffect(() => {
    fetchPoints();
    fetchPlayers();
  }, [allPlayers]);

  const local_ready = async () => {
    try {
      await api.put(`/players/${localUsername}`, JSON.stringify({ready: true}));
      setButtonClicked(true);
    } catch (error) {
      alert(
        `Something went wrong while getting ready: \n${handleError(error)}`
      );
    }
  };
  const start_game = async () => {
    try {
      navigate(`/game/${localLobbyName}`);
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };
  const players_ready = (players) => {
    return players.filter(player => player.ready).length;
  };
  const fetchPoints = async () => {
    try {
      const response = await api.get(`/rounds/leaderboard/${localGameId}`);
      const sortedPlayers: { username: string; points: number }[] = Object.entries(response.data)
        .map(([username, points]: [string, number]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);
      setPlayersPoints(sortedPlayers);
    } catch (error) {
      alert(
        `Something went wrong during fetching the points: \n${handleError(error)}`
      );
    }
  }
  const fetchPlayers = async () =>{
    try {
      const response = await api.get(`/lobby/players/${localLobbyId}`);
      setAllPlayers(response.data);
      console.log(allPlayers)

      if(allPlayers.length!==0 && allPlayers.length===players_ready(allPlayers)){
        start_game();
      }
    } catch (error){
      alert(
        `Something went wrong during fetching the players: \n${handleError(error)}`
      );
    }
  }

  return (
    <BaseContainer>
      <div className="leaderboard container">
        <div className="leaderboard form">
          <div className="leaderboard centered-text">
          <h1>Ranking</h1>
          <ul className="leaderboard user-list">
            {playersPoints.map((player, index) => (
              <li key={index} className="leaderboard li">
                <Player user={player} index={index} />
              </li>
            ))}
          </ul>
            <div className="leaderboard ready">
              {players_ready(allPlayers)}/{allPlayers.length} players are ready
            </div>
            <Button
              className="secondary-button"
              width="60%"
              onClick={local_ready}
              disabled={readyButtonClicked}
            >
              ready
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Leader;
