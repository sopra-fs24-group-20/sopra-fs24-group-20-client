import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import "styles/views/Authentication.scss";
import { Lobby, User } from "types";
import Confetti from "react-confetti";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
import LobbyPage from "./LobbyPage";

const Player = ({ user, index }) => {
  // Define medal emojis
  const medalEmojis = ["🥇", "🥈", "🥉"];

  // Determine confetti color based on index
  const confettiColors = index === 1 ? ["#b9a741","#e8d152","#ecda74","#d0bc49"] : index === 2 ? ["#7a7a7a","#999999","#adadad","#c0c0c0"] : index === 3 ? ["#8f5823","#a46528","#b8722d","#CD7F32"]: [];

  return (
    <div className="player-row">
      <div className="player-col">
        {index < 4 ? <span className="medal">{medalEmojis[index - 1]}</span> : <span>{index}.</span>}
      </div>
      <div className="player-col2">
        {user.username && user.username.replace(/^Guest:/, "")}
      </div>
      <div className="player-col">
        {user.points}pt
      </div>
      {(localStorage.getItem("username")) === user.username ?
        <span>
          <Confetti
            colors={confettiColors}
            width={window.innerWidth}
            numberOfPieces={500}
            height={window.innerHeight}
          />
        </span>:""
      }
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
  const [loading, setLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState([]);
  const mockplayers = { "barbara": 35 , "paul": 25, "glory":20,"joshi":35 };
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const gameId = localStorage.getItem("gameId");
  const lobbyId = localStorage.getItem("lobbyId");
  const [owner, setOwner] = useState<boolean>(false);
  const localUsername = localStorage.getItem("username");
  const sortedMOCKPlayers: { username: string; points: number }[] = Object.entries(mockplayers)
    .map(([username, points]: [string, number]) => ({ username, points }))
    .sort((a, b) => b.points - a.points);


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
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
      try {
        const response = await api.get(`/lobby/settings/${lobbyId}`);
        if (localUsername === response.data.lobbyOwner.username) {
          setOwner(true);
        }
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const returnToLobby = async () => {
    setLoading(true);
    if (owner === true){
      try{
        const response = await api.post(`/game/done/${lobbyId}`, localUsername);
        if (response.status === 200){
          console.log("lobby host: successfully reset points")
          navigate(`/lobby/${localLobbyName}`);
        }
      }catch(error){
        alert("lobby host: failed to reset points");
      }
    }
    console.log("not lobby host: did not reset points");
    navigate(`/lobby/${localLobbyName}`);
  }

  const calculateRanks = (players) => {
    if (!players.length) return [];

    const ranks = [];
    let rank = 1;
    let prevPoints = players[0].points;

    for (let i = 0; i < players.length; i++) {
      if (i > 0 && players[i].points < prevPoints) {
        rank = i + 1;
      }
      ranks.push(rank);
      prevPoints = players[i].points;
    }

    return ranks;
  };

  const ranks = calculateRanks(players);


  if (loading) {
    return (
      <BaseContainer>
        <div className="authentication container">
          <div className="authentication form">
            <CategoriesLoadingScreen />
          </div>
        </div>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer>
      <div className="leaderboard container">
        <div className="leaderboard form">
          <h1 className="leaderboard centered-text">Final Ranking</h1>
          <ul className="leaderboard user-list">
            {players.map((player, index) => (
              <li key={index} className="leaderboard li">
                <Player user={player} index={ranks[index]} />
              </li>
            ))}
          </ul>
        </div>
        <div className="authentication button-container">
          <Button width="100%" 
            onClick = {() => returnToLobby()}>
            Back to Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default FinalLeader;
