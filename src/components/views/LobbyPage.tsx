import React, { useEffect, useState } from "react";
import { api, handleError} from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import webSocketService from "helpers/websocketContext";
import "styles/views/Authentication.scss";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
import "styles/views/Settings.scss";

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
      {user.username && user.username.replace(/^Guest:/, "")}
    </div>
    <div className="lobby_player container">
      <object type="image/svg+xml" data={hashUsername(user.username)}></object>
    </div>
  </div>
);

const FormField = (props) => {
  return (
    <div className="settings field">
      <input
        className="settings input"
        placeholder={props.placeholder}
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.showDelete && (
        <div className="settings delete" onClick={props.onDelete}>
          ❌
        </div>
      )}
    </div>
  );
};

FormField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  showDelete: PropTypes.bool,
};

Player.propTypes = {
  user: PropTypes.object,
};

const LobbyPage = () => {
  const navigate = useNavigate();
  const localLobbyName = localStorage.getItem(("lobbyName"));
  const local_username = localStorage.getItem("username");
  const [readyButtonClicked, setButtonClicked] = useState(false);
  const localLobbyId = localStorage.getItem(("lobbyId"))
  const [readyPlayers, setReadyPlayers] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchLoaded, setFetchLoaded] = useState<boolean>(false);
  const [wsLoaded, setWsLoaded] = useState<boolean>(false);
  const [hostLoaded, setHostLoaded] = useState<boolean>(false);
  const [owner, setOwner] = useState<boolean>(false);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);
  const [settings, setSettings] = useState({ categories: [], gameMode: 1 });
  const [disableSave, setDisableSave] = useState(false);
  const [error, setError] = useState(null);
  const [saveConfirmation, setSaveConfirmation] = useState(null);
  const [roundsError, setRoundsError] = useState(null);
  const [timeError, setTimeError] = useState(null);
  const [excludedCharError, setExcludedCharError] = useState(null);

  useEffect(() => {
    const fetchGameId = async () => {
      try{
        const response = await api.get(`game/${localLobbyId}`);
        if (response.status === 200){
          localStorage.setItem("gameId", response.data.toString());
          localStorage.setItem("currentRound", "0");
          console.log(localLobbyId);
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


      webSocketService.subscribe(
        "/topic/ready-count",
        async (message) => {
          const messageData = JSON.parse(message.body);
          if (messageData.command === "start" && messageData.lobbyId.toString() === localLobbyId) {
            await handleStartGame();
          }
        },
        {lobbyId: localLobbyId, username: local_username}
      );

      webSocketService.subscribe(
        "/topic/online-players",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log(messageData);
          if (messageData && messageData.lobbyId.toString() === localLobbyId){
            console.log("in ig of online players")
            const { readyPlayers, onlinePlayers } = messageData; // Destructuring to extract readyPlayers and onlinePlayers
            if (onlinePlayers !== 0){
              setReadyPlayers(readyPlayers);
              console.log("ready players set");
              setOnlinePlayers(onlinePlayers);
              console.log("online players set");
              await fetchPlayers();
              console.log("fetched players and lobby host");
            }
            else{
              setReadyPlayers(readyPlayers);
              console.log("ready players set");
              setOnlinePlayers(onlinePlayers);
              console.log("online players set");
            }

          }
        },
        {lobbyId: localLobbyId}
      );

      setWsLoaded(true);
      // Cleanup function to unsubscribe when the component unmounts or dependencies change

      return () => {
        webSocketService.unsubscribe("/topic/ready-count");
        webSocketService.unsubscribe("/topic/online-players");
      };
    };

    // Call the async function
    subscribeToWebSocket();

    return () => {
      webSocketService.unsubscribe("/topic/ready-count");
      webSocketService.unsubscribe("/topic/online-players");
    }

    // Empty dependency array means this effect runs once when the component mounts
  }, []);

  useEffect(() => {
    if (fetchLoaded && wsLoaded && hostLoaded && settingsLoaded) {
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
      await api.put(`/lobby/leave/${localLobbyId}?username=${local_username}`);
      if (webSocketService.connected){
        webSocketService.sendMessage("/app/leave", { username: local_username , lobbyId: localLobbyId });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await webSocketService.disconnect();
      }
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("currentRound");
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
    } catch (error){
      alert(
        `Something went wrong during fetching the players: \n${handleError(error)}`
      );
    }

    try{
      const response = await api.get(`/lobby/settings/${localLobbyId}`);
      if (local_username === response.data.lobbyOwner.username) {
        setOwner(true);
      }
      setHostLoaded(true);
    }catch(error){
      alert(
        `Something went wrong when fetching the settings: \n${handleError(error)}`
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetchData();
    }
    validateCategories();
  }, [settings]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/lobby/settings/${localLobbyId}`);
      setSettings(response.data);
      console.log(response.data);
    } catch (error) {
      alert(`Something went wrong during fetching the settings: \n${handleError(error)}`);
    } finally {
      setSettingsLoaded(true);
    }
  };

  const validateCategories = () => {
    const isEmpty = settings.categories.some((category) => category.trim() === "");
    setDisableSave(isEmpty);
  };

  const saveChanges = async () => {
    try {

      if (settings.roundDuration < 10 || settings.roundDuration > 180 || settings.rounds < 1 || settings.rounds > 10 || settings.excludedChars.length > 10) {
        setTimeError(null);
        setRoundsError(null);
        setExcludedCharError(null);
        if (settings.roundDuration < 10 || settings.roundDuration > 180) {
          setTimeError("Time must be between 10 and 180 seconds");
        }
        if (settings.rounds < 1 || settings.rounds > 10) {
          setRoundsError("Number of rounds must be between 1 and 10");
        }
        if (settings.excludedChars.length > 10) {
          setExcludedCharError("Number of omitted letters must be smaller than 10");
        }

        return;
      }

      setTimeError(null);
      setRoundsError(null);
      setExcludedCharError(null);

      console.log("settings when sending them:",settings);
      await api.put(`/lobby/settings/${localLobbyId}`, JSON.stringify(settings));
      setSaveConfirmation("Settings saved successfully!");
      setError(null);
      setTimeout(() => {
        setSaveConfirmation(null);
      }, 4000);
    } catch (error) {
      console.log(handleError(error));
      setError("Are your excluded letters in the right format e.g. X,Y,Z ?");
      setSaveConfirmation(null);
    }
  };

  const addCategory = () => {
    const lastCategory = settings.categories[settings.categories.length - 1];
    if (lastCategory && lastCategory.trim() !== "") {
      if (settings.categories.length < 8) {
        setSettings({ ...settings, categories: [...settings.categories, ""] });
      }
    } else {
      alert("Please fill in the previous category field before adding another.");
    }
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...settings.categories];
    updatedCategories[index] = value;
    setSettings({ ...settings, categories: updatedCategories });
  };

  const deleteCategory = (index) => {
    const updatedCategories = [...settings.categories];
    updatedCategories.splice(index, 1);
    setSettings({ ...settings, categories: updatedCategories });
  };

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
      <div className={`lobby main-container ${owner ? 'owner' : ''}`}>
        <div className="lobby container">
          <div className="lobby form" style={{ width: owner ? "100%" : "60%" }}>
            <div className="lobby header">
              <Button
                className="secondary-button exit-button"
                onClick={exit}
                style={{marginTop: "10px"}}
              >
                Exit Lobby
              </Button>
            </div>
            <div className="lobby centered-text">
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
                style={{marginBottom: "10px"}}
              >
                Ready
              </Button>
            </div>
          </div>
        </div>
        {owner && (
          <div className="settings container">
            <div className="settings form">
              <div>
                <h2 className="settings centered-text">Settings</h2>
                {error && <div className="settings error-message">{error}</div>}
                {saveConfirmation && (
                  <div className="settings success-message">{saveConfirmation}</div>
                )}
                <div className="settings column">
                  Categories
                  {settings.categories &&
                    settings.categories.map((category, index) => (
                      <FormField
                        key={index}
                        placeholder="enter here..."
                        value={category}
                        onChange={(value) => handleCategoryChange(index, value)}
                        onDelete={() => deleteCategory(index)}
                        type="text"
                        showDelete={settings.categories.length > 1}
                      />
                    ))}
                  {settings.categories.length < 8 && (
                    <Button onClick={addCategory}>Add Category</Button>
                  )}
                </div>
                <div className="settings column">
                  Time (sec)
                  <FormField
                    value={settings.roundDuration ? settings.roundDuration.toString() : ""}
                    onChange={(time) =>
                      setSettings({
                        ...settings,
                        roundDuration: parseInt(time, 10) || 0,
                      })
                    }
                    type="number"
                  />
                  {timeError && (
                    <div className="settings error-message">{timeError}</div>
                  )}
                  Rounds
                  <FormField
                    value={settings.rounds ? settings.rounds.toString() : ""}
                    onChange={(rounds) =>
                      setSettings({
                        ...settings,
                        rounds: parseInt(rounds, 10) || 0,
                      })
                    }
                    type="number"
                  />
                  {roundsError && <div className="settings error-message">{roundsError}</div>}
                  Exclude Letter
                  <FormField
                    value={settings.excludedChars ? settings.excludedChars.join(",").toUpperCase() : ""}
                    placeholder="e.g. X,Y,Z"
                    onChange={(excludedChars) =>
                      setSettings({
                        ...settings,
                        excludedChars: excludedChars.split(",").map(char => char.trim()),
                      })
                    }
                    type="text"
                  />
                  {excludedCharError && <div className="settings error-message">{excludedCharError}</div>}
                </div>
                <div className="settings column">
                  Game Mode
                  <select
                    className="settings dropdown"
                    value={settings.gameMode}
                    onChange={(e) => setSettings({ ...settings, gameMode: parseInt(e.target.value, 10) })}
                  >
                    <option value={"NORMAL"}>normal</option>
                    <option value={"HARD"}>hard</option>
                  </select>
                </div>
              </div>
              <div className="settings centered-text">
                <Button
                  className="secondary-button"
                  width="60%"
                  onClick={saveChanges}
                  disabled={!owner || disableSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseContainer>
  );

};

export default LobbyPage;
