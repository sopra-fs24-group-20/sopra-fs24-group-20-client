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
  return (
    <div>
      <div className="leaderboard username">
        {index + 1}. {user.username} {user.points}pt
      </div>
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
  const sortedMOCKPlayers: { username: string; points: number }[] = Object.entries(mockplayers)
    .map(([username, points]: [string, number]) => ({ username, points }))
    .sort((a, b) => b.points - a.points);



  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/rounds/leaderboard/${1}`);
        const sortedPlayers: { username: string; points: number }[] = Object.entries(response.data)
          .map(([username, points]: [string, number]) => ({ username, points }))
          .sort((a, b) => b.points - a.points);

        setPlayers(sortedPlayers);
        console.log(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, []);

  return (
    <BaseContainer>
      <div className="leaderboard container">
        <div className="leaderboard form">
          <h2 className="leaderboard centered-text">Final Ranking</h2>
          <ul className="leaderboard user-list">
            {players.map((player, index) => (
              <li key={index} className="leaderboard li">
                <Player user={player} index={index} />
              </li>
            ))}
          </ul>
          <Button width="100%" onClick={() => navigate(`/lobby/${lobby.lobbyName}`)}>
            Back to Lobby
          </Button>
          <Confetti
            colors={["#64f1f1","#9135a4","#ff03bf","#e8d152","#c0c0c0"]}
            width={window.innerWidth}
            numberOfPieces={500}
            height={window.innerHeight}>
          </Confetti>
        </div>
      </div>
    </BaseContainer>
  );
};

export default FinalLeader;
