import React, { useEffect, useState } from "react";
import { api, handleError} from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
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
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const local_username = localStorage.getItem("username");
  const [readyButtonClicked, setButtonClicked] = useState(false);
  const localLobbyId = localStorage.getItem(("lobbyId"))
  const [ready_ws, setReadyWS] = useState(null);
  const [new_join, setNewJoinWS] = useState(null);
  const [allPlayers, setAllPlayers] = useState([]);



  useEffect(() => {
    const intervalId = setInterval(fetchPlayers, 2000); // 2000 milliseconds = 2 seconds
  
    // Cleanup function to clear the interval when component unmounts or when allPlayers changes
    return () => clearInterval(intervalId);
  }, [allPlayers]);
  

  /*useEffect(() => {

    const lobbyRefreshSubscription = subscribeToTopic(
      "/topic/lobby-refresh",
      (response) => {
        const data = JSON.parse(response.body);
        if (data.command === "refresh") {
          fetchPlayers();
        }
      }
    );

    const gameControlSubscription = subscribeToTopic(
      "/topic/ready-count",
      (response) => {
        const data = JSON.parse(response.body);
        console.log(data);
        if (data.command === "start") {
          start_game();
        }
      }
    );

    fetchPlayers();

    return () => {
      lobbyRefreshSubscription.unsubscribe();
      gameControlSubscription.unsubscribe();
    };
  }, []);*/

  const exit = async () => {
    try {
      await api.put(`/lobby/leave/${localLobbyId}?username=${local_username}`);
      // client.send("/topic/refresh", {}, "{}");
      // client.disconnect();
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("gamews");
      await api.put(`/players/${local_username}`, JSON.stringify({ready: false}));
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
      // client.send("/app/ready-up", {}, JSON.stringify({ username: local_username, lobbyId:localLobbyId }));
    } catch (error) {
      alert(
        `Something went wrong while getting ready: \n${handleError(error)}`
      );
    }
  };

  const players_ready = (players) => {
    return players.filter(player => player.ready).length;
  };

  const start_game = async () => {
    try {
      localStorage.setItem("gamews", "false")
      await api.put(`/players/${local_username}`, JSON.stringify({ready: false}));
      navigate(`/game/${localLobbyName}`);
    } catch (error) {
      alert(`Error starting game: ${handleError(error)}`);
    }
  };

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
