import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import { Lobby, User } from "types";
import Confetti from "react-confetti";

const Player = ({ user, index }) => {
  // Define medal emojis
  const medalEmojis = ["🥇", "🥈", "🥉"];

  return (
    <div className="player-row">
      <div className="player-col">
        {/* Render medal emoji or placeholder */}
        {index < 3 ? <span className="medal">{medalEmojis[index]}</span> : ""}
      </div>
      <div className="player-col2">{user.username}</div>
      <div className="player-col">{user.points}pt</div>
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object,
  index: PropTypes.number,
};

const FinalLeader = () => {
  const navigate = useNavigate();
  const [lobby, setLobby] = useState<Lobby[]>({});
  const [players, setPlayers] = useState([]);
  const mockplayers = { "barbara": 30 , "paul": 25, "glory":20,"joshi":35 };
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const gameId = localStorage.getItem("gameId");
  const sortedMOCKPlayers: { username: string; points: number }[] = Object.entries(mockplayers)
    .map(([username, points]: [string, number]) => ({ username, points }))
    .sort((a, b) => b.points - a.points);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/rounds/leaderboard/${gameId}`);
        const sortedPlayers: { username: string; points: number }[] = Object.entries(response.data)
          .map(([username, points]: [string, number]) => ({ username, points }))
          .sort((a, b) => b.points - a.points);

        setPlayers(sortedPlayers);
        console.log(response.data);
      } catch (error) {
        alert(
          `Something went wrong during exiting the lobby: \n${handleError(error)}`
        );
      }
    }
    fetchData();
  }, []);

  return (
    <BaseContainer>
      <div className="leaderboard container">
        <div className="leaderboard form">
          <h1 className="leaderboard centered-text">Final Ranking</h1>
          <ul className="leaderboard user-list">
            {players.map((player, index) => (
              <li key={index} className="leaderboard li">
                <Player user={player} index={index} />
              </li>
            ))}
          </ul>
          <Confetti
            colors={["#64f1f1","#9135a4","#ff03bf","#e8d152","#c0c0c0"]}
            width={window.innerWidth}
            numberOfPieces={500}
            height={window.innerHeight}>
          </Confetti>
        </div>
        <div className="authentication button-container">
          <Button width="100%" onClick={() => navigate(`/lobby/${localLobbyName}`)}>
            Back to Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default FinalLeader;
