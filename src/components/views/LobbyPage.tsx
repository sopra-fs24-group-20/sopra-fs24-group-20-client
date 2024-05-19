import React, { useEffect, useState } from "react";
import { api, handleError} from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import webSocketService from "helpers/websocketContext";
import "styles/views/Authentication.scss";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

import PropTypes from "prop-types";
// @ts-ignore
import svgImage1 from "images/1.svg";
// @ts-ignore
import svgImage2 from "images/2.svg";
// @ts-ignore
import svgImage3 from "images/3.svg";
// @ts-ignore
import svgImage4 from "images/4.svg";
// @ts-ignore
import svgImage5 from "images/5.svg";
// @ts-ignore
import svgImage6 from "images/6.svg";
// @ts-ignore
import svgImage7 from "images/7.svg";
// @ts-ignore
import svgImage8 from "images/8.svg";
// @ts-ignore
import svgImage9 from "images/9.svg";
// @ts-ignore
import svgImage10 from "images/10.svg";
// @ts-ignore
import svgImage11 from "images/11.svg";
// @ts-ignore
import svgImage12 from "images/12.svg";
// @ts-ignore
import svgImage13 from "images/13.svg";
// @ts-ignore
import svgImage14 from "images/14.svg";
// @ts-ignore
import svgImage15 from "images/15.svg";
// @ts-ignore
import svgImage16 from "images/16.svg";
// @ts-ignore
import svgImage17 from "images/17.svg";
// @ts-ignore
import svgImage18 from "images/18.svg";
// @ts-ignore
import svgImage19 from "images/19.svg";
// @ts-ignore
import svgImage20 from "images/20.svg";
// @ts-ignore
import svgImage21 from "images/21.svg";
// @ts-ignore
import svgImage22 from "images/22.svg";
// @ts-ignore
import svgImage23 from "images/23.svg";
// @ts-ignore
import svgImage24 from "images/24.svg";
// @ts-ignore
import svgImage25 from "images/25.svg";
import { all } from "axios";

const CryptoJS = require("crypto-js");
const all_pictures = [svgImage1, svgImage2, svgImage3, svgImage4,svgImage5,svgImage6,svgImage7,svgImage8,svgImage9,svgImage10,svgImage11,svgImage12,svgImage13,svgImage14,svgImage15,svgImage16,svgImage17,svgImage18,svgImage19,svgImage20,svgImage21,svgImage22,svgImage23,svgImage24,svgImage25];

function hashUsername(username) {
  const hashedUsername = CryptoJS.SHA256(username).toString(CryptoJS.enc.Hex);
  const hashedInt = parseInt(hashedUsername, 16);
  const containerIndex = hashedInt % 25;

  return all_pictures[containerIndex];
}

const Player = ({ user }) => (
  <div className="centered-text">
    <div className="lobby_player username">
      {user.username}
    </div>
    <div className="lobby_player container">
      <object type="image/svg+xml" data={hashUsername(user.username)}></object>
    </div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const LobbyPage = () => {
  const navigate = useNavigate();
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const local_username = localStorage.getItem("username");
  const [readyButtonClicked, setButtonClicked] = useState(false);
  const localLobbyId = localStorage.getItem(("lobbyId"))
  const [ready_ws, setReadyWS] = useState(null);
  const [new_join, setNewJoinWS] = useState(null);
  const [readyPlayers, setReadyPlayers] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchLoaded, setFetchLoaded] = useState<boolean>(false);
  const [wsLoaded, setWsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchGameId = async () => {
      try{
        const response = await api.get(`game/${localLobbyId}`);
        if (response.status === 200){
          localStorage.setItem("gameId", response.data.toString());
          await fetchPlayers();
          setFetchLoaded(true);
        }

      }catch(error){
        alert(
          `Something went wrong when fetching the gameId: \n${handleError(error)}`
        );
      }
    }
    fetchGameId();
  }, [])


  useEffect(() => {
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
        await webSocketService.sendMessage("/app/join", { username: local_username, lobbyId: localLobbyId });
      }

      const handleReadyCountMessage = async (message) => {
        const messageData = JSON.parse(message.body);
        if (messageData.command === "start" && messageData.lobbyId.toString() === localLobbyId) {
          await handleStartGame();
        } /*else {
          const readyPlayersCount = messageData.readyPlayers !== undefined ? messageData.readyPlayers : 0;
          const onlinePlayersCount = messageData.onlinePlayers !== undefined ? messageData.onlinePlayers : 0;
          setReadyPlayers(readyPlayersCount);
          setOnlinePlayers(onlinePlayersCount);
          fetchPlayers();
        }*/
      };
      
      const handleOnlinePlayersMessage = async (message) => {
        const messageData = JSON.parse(message.body);
        console.log(messageData);
        if (messageData && messageData.lobbyId.toString() === localLobbyId){
          const { readyPlayers, onlinePlayers } = messageData; // Destructuring to extract readyPlayers and onlinePlayers
          setReadyPlayers(readyPlayers);
          setOnlinePlayers(onlinePlayers);
          fetchPlayers();
        }
      }

      const readyCountSubscription = webSocketService.subscribe(
        "/topic/ready-count",
        handleReadyCountMessage,
        {lobbyId: localLobbyId, username: local_username}
      );

      const handleOnlinePlayersSubscription = webSocketService.subscribe(
        "/topic/online-players",
        handleOnlinePlayersMessage,
        {lobbyId: localLobbyId}
      );
  
      // Subscribe to the topic
      /*const subscription = webSocketService.subscribe(
        "/topic/ready-count",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log("Received messageData:", messageData);
          console.log("message.command:", message.command);
          console.log("Received messageData:", messageData.lobbyId);
  
          if (messageData.command === "start" && messageData.lobbyId.toString() === localLobbyId) {
            await handleStartGame();
          } else {
            const readyPlayersCount = messageData.readyPlayers !== undefined ? messageData.readyPlayers : 0;
            const onlinePlayersCount = messageData.onlinePlayers !== undefined ? messageData.onlinePlayers : 0;
            setReadyPlayers(readyPlayersCount.toString());
            setOnlinePlayers(onlinePlayersCount.toString());
            fetchPlayers();
          }
        },
        { lobbyId: localLobbyId, username: local_username }
      );*/
      setWsLoaded(true);
      // Cleanup function to unsubscribe when the component unmounts or dependencies change
      return () => {
        webSocketService.unsubscribe(readyCountSubscription);
        webSocketService.unsubscribe(handleOnlinePlayersSubscription);
      };
    };
  
    // Call the async function
    subscribeToWebSocket();
    
    // Empty dependency array means this effect runs once when the component mounts
  }, []);

  useEffect(() => {
    if (fetchLoaded && wsLoaded) {
      setLoading(false); // Set loading to false when both settings and letter are loaded
    }
  }, [fetchLoaded, wsLoaded]);
  

  const handleStartGame = async () => {
    try {
      setLoading(true);
      await api.put(`/players/${local_username}`, JSON.stringify({ ready: false }));
      console.log("ready false on lobby page");
      setLoading(false);
      navigate(`/game/${localLobbyName}`);
    } catch (error) {
      alert(`Error starting game: ${handleError(error)}`);
    }
  };

  /*useEffect(() => {
    const intervalId = setInterval(fetchPlayers, 2000); // 2000 milliseconds = 2 seconds
    
    // Cleanup function to clear the interval when component unmounts or when allPlayers changes
    return () => clearInterval(intervalId);
  }, [allPlayers]);*/
  

  const exit = async () => {
    try {
      setLoading(true);
      if (webSocketService.connected){
        webSocketService.sendMessage("/app/leave", { username: local_username , lobbyId: localLobbyId });
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await webSocketService.disconnect();
      }
      await api.put(`/lobby/leave/${localLobbyId}?username=${local_username}`);
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("round");
      await api.put(`/players/${local_username}`, JSON.stringify({ready: false}));
      setLoading(false);
      navigate(`/user/${local_username}`);
    } catch (error) {
      alert(
        `Something went wrong when exiting the lobby: \n${handleError(error)}`
      );
    }
  };

  const local_ready = async () => {
    try {
      await api.put(`/players/${local_username}`, JSON.stringify({ready: true}));
      setButtonClicked(true);
      webSocketService.sendMessage("/app/ready-up", {username: local_username, lobbyId: localLobbyId});
      // client.send("/app/ready-up", {}, JSON.stringify({ username: local_username, lobbyId:localLobbyId }));
    } catch (error) {
      alert(
        `Something went wrong while getting ready: \n${handleError(error)}`
      );
    }
  };

  const fetchPlayers = async () =>{
    try {
      const response = await api.get(`/lobby/players/${localLobbyId}`);
      setAllPlayers(response.data);
      setOnlinePlayers(response.data.length);
      console.log(allPlayers)
      /*if(allPlayers.length!==0 && allPlayers.length===players_ready(allPlayers)){
        start_game();
      }*/
    } catch (error){
      alert(
        `Something went wrong during fetching the players: \n${handleError(error)}`
      );
    }
  }

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
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <div className="lobby settings"
              onClick={() => navigate(`/settings/${localLobbyName}`)}
            >
           ⚙️
            </div>
            <h1 className="lobby title">{localLobbyName}</h1>

            <ul className="lobby ul">
              {allPlayers.map((player, index) => (
                <li key={index} className="lobby li">
                  <Player user={player} />
                </li>
              ))}
            </ul>

            <div className="lobby ready">
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
