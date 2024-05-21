import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import "styles/views/Authentication.scss";
import webSocketService from "helpers/websocketContext";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

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
  const [loading, setLoading] = useState<boolean>(false);

  const localLobbyName = localStorage.getItem(("lobbyName"));
  const localUsername = localStorage.getItem("username");
  const localLobbyId = localStorage.getItem(("lobbyId"));
  const localGameId = localStorage.getItem("gameId");

  const [readyPlayers, setReadyPlayers] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  const [readyButtonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    fetchPlayers();
    fetchPoints();
    const subscribeToWebSocket = async () => {
      // If the websocket is not connected, connect and wait until it is connected
      if (!webSocketService.connected) {
        // Establish websocket connection
        webSocketService.connect();

        // Wait until actually connected to websocket
        await new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (webSocketService.connected) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });

        // Send the join message once connected
        await webSocketService.sendMessage("/app/join", { username: localUsername, lobbyId: localLobbyId });
      }
    
      const subscription = webSocketService.subscribe(
        "/topic/ready-count",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log("Received messageData:", messageData);
          console.log("message.command:", message.command);
          console.log("Received messageData:", messageData.lobbyId);
          if (messageData.command === "start" && messageData.lobbyId.toString() === localLobbyId) {
            await start_game();
          } else {
            const readyPlayersCount = messageData.readyPlayers !== undefined ? messageData.readyPlayers : 0;
            const onlinePlayersCount = messageData.onlinePlayers !== undefined ? messageData.onlinePlayers : 0;
            setReadyPlayers(readyPlayersCount.toString());
            setOnlinePlayers(onlinePlayersCount.toString());
            fetchPlayers();
            fetchPoints();
          }
        },
        { lobbyId: localLobbyId, username: localUsername }
      );

      return () => {
        webSocketService.unsubscribe(subscription);
      };
    };
    subscribeToWebSocket();
  }, []);

  const local_ready = async () => {
    try {
      await api.put(`/players/${localUsername}`, JSON.stringify({ready: true}));
      setButtonClicked(true);
      webSocketService.sendMessage("/app/ready-up", {username: localUsername, lobbyId: localLobbyId});
    } catch (error) {
      alert(
        `Something went wrong while getting ready: \n${handleError(error)}`
      );
    }
  };
  const start_game = async () => {
    try {
      await api.put(`/players/${localUsername}`, JSON.stringify({ready: false}));
      navigate(`/game/${localLobbyName}`);
    } catch (error) {
      alert(
        `Something went wrong while preparing the game: \n${handleError(error)}`
      );
    }
  };
  const fetchPoints = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rounds/leaderboard/${localGameId}`);
      const sortedPlayers: { username: string; points: number }[] = Object.entries(response.data)
        .map(([username, points]: [string, number]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);
      setPlayersPoints(sortedPlayers);
    } catch (error) {
      alert(
        `Something went wrong during fetching the points: \n${handleError(error)}`
      );
    } finally {
      setLoading(false);
    }
  }
  const fetchPlayers = async () =>{
    try {
      setLoading(true);
      const response = await api.get(`/lobby/players/${localLobbyId}`);
      setAllPlayers(response.data);
      setOnlinePlayers(response.data.length);
      console.log(response.data)
      /*if(allPlayers.length!==0 && allPlayers.length===players_ready(allPlayers)){
        start_game();
      }*/
    } catch (error){
      alert(
        `Something went wrong during fetching the players: \n${handleError(error)}`
      );
    } finally {
      setLoading(false);
    }
  }

  const exit = async () => {
    try {
      setLoading(true);
      if (webSocketService.connected){
        webSocketService.sendMessage("/app/leave", { username: localUsername , lobbyId: localLobbyId });
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await webSocketService.disconnect();
      }
      await api.put(`/lobby/leave/${localLobbyId}?username=${localUsername}`);
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("currentRound");
      await api.put(`/players/${localUsername}`, JSON.stringify({ready: false}));
      setLoading(false);
      navigate(`/user/${localUsername}`);
    } catch (error) {
      alert(
        `Something went wrong when exiting the lobby: \n${handleError(error)}`
      );
    }
  };



  return (
    <BaseContainer>
      <div className="leaderboard container">
        <div className="leaderboard form">
        <div className="authentication back-arrow">
          <Button
              className="secondary-button"
              width="fit-content"
              onClick={() => exit()}
            >
              Exit Lobby
            </Button>
        </div>
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
              {readyPlayers}/{onlinePlayers} players are ready
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
