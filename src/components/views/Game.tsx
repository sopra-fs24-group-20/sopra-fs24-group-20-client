import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import webSocketService from "helpers/websocketContext";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
import "styles/views/Authentication.scss";

const FormField = (props) => {
  return (
    <div className="game field">
      <label className="game label">{props.label}</label>
      <input
        className="game input"
        placeholder="enter here.."
        value={props.value.slice(0, 30)}
        onChange={(e) => props.onChange(e.target.value)}
        disabled={props.disabled}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

const Game = () => {
  const navigate = useNavigate();
  const [letter, setLetter] = useState<string>("");
  const [countdownInterval, setCountdownInterval] = useState<any>(null); // State variable for interval ID
  const lobbyName = localStorage.getItem("lobbyName");
  const username = localStorage.getItem("username");
  const gameId = localStorage.getItem("gameId");
  const lobbyId = localStorage.getItem("lobbyId");
  const [roundDuration, setroundDuration] = useState<number>();
  const [countdown, setCountdown] = useState<number>(roundDuration);
  const [categories, setCategories] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState(null);
  const [position, setPosition] = useState<string>("");
  const [showStopPopup, setShowStopPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [letterLoaded, setLetterLoaded] = useState(false);
  const [positionLoaded, setPositionLoaded] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [roundsHandled, setRoundsHandled] = useState<boolean>(false);
  const[inputDisabled, setInputDisabled] = useState<boolean>(false);

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
        await webSocketService.sendMessage("/app/join", { username: username, lobbyId: lobbyId });
      }


      webSocketService.subscribe(
        "/topic/game-control",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log("Received messageData:", messageData);
          console.log("message.command:", message.command);
          if (messageData.command === "stop" && messageData.lobbyId.toString() === lobbyId) {
            console.log("received stop");
            // this should stop the game, since when the timer hits 0 the game should stop 
            clearInterval(countdownInterval);
            if (countdown !== 0){
              setCountdown(0)
            }
          }
        },
        { lobbyId: lobbyId }
      );

      // checking whether all have successfully submitted entries before going to next screen
      webSocketService.subscribe(
        "/topic/game-answers",
        async(message) => {
          const messageData = JSON.parse(message.body);
          if (messageData.command === "game-done" && messageData.lobbyId.toString() === lobbyId){
            console.log("received all answers");
            setLoading(false);
            navigate(`/evaluation/${lobbyName}`);
          }
        },
        {lobbyId: lobbyId, username: username }
      );
      

      return () => {

        webSocketService.unsubscribe("/topic/game-control");
        webSocketService.unsubscribe("/topic/game-answers");
      };
    };

    subscribeToWebSocket();

    return () => {
      webSocketService.unsubscribe("/topic/game-control");
      webSocketService.unsubscribe("/topic/game-answers");
    }

  }, []);


  const getFormattedData = () => {

    const data: { [key: string]: string } = { username };
    categories.forEach((category, index) => {
      data[category] = answers[category] || "";
    });
    console.log("formatted data", JSON.stringify(data));
    if (localStorage.getItem("answers")){
      return JSON.stringify(data);
    }

    return JSON.stringify(data);
  };

  const doStop = async () => {
    console.log("in dostop");
    await api.put(`/players/${username}`, JSON.stringify({ready: false}));
    console.log("put ready to false");
    // clearInterval(countdownInterval); // Stop the countdown timer
    // console.log("cleared timer");
    const index = players.indexOf(username);
    const delayInSeconds = index * 1;
    // send the answers to backend for verification

    const submitData = async () => {
      const answer = getFormattedData();
      console.log("answer", answer);
      console.log("got formatted data");
      const submisstionTime = new Date();
      try {
        const response = await api.post(`/rounds/${gameId}/entries`, answer);
        if (response.status === 200){
          console.log("submitted answers");
          webSocketService.sendMessage("/app/game-submitted", {username: username, lobbyId: lobbyId});
          setLoading(true);
        }
      }catch(error){
        setError("Error subbmitting data");
        if (error.response && error.response.status === 500){
          console.log("encountered 500 error. Retrying to submit data in intervals...");
          setTimeout(submitData, 1200);
        }
        
        return;
      }
    };
    setTimeout(submitData, delayInSeconds * 1000);

  };

  const getLetter = async () => {
    try {
      // await api.put(`/players/${username}`, JSON.stringify({ready: false}));
      const response = await api.get(`/rounds/letters/${gameId}`);
      setLetter(response.data);
      setLetterLoaded(true);
    } catch (error) {
      console.log("Error fetching the current letter");
    }
    try{
      const response = await api.get(`/rounds/letterPosition/${gameId}`);
      const pos = response.data.toString();
      if (pos === "-1"){
        setPosition("last");
      }
      else if (pos === "0"){
        setPosition("first");
      }
      else if (pos === "1"){
        setPosition("second");
      }
      else if (pos === "2"){
        setPosition("third");
      }
      setPositionLoaded(true);
    }catch (error) {
      console.log("Error fetching the current letter");
    }
  };

  const settings = async() => {
    try {
      const response = await api.get(`/lobby/settings/${lobbyId}`);
      console.log(gameId);
      const categories = response.data.categories;
      const totalRounds = response.data.rounds;
      localStorage.setItem("totalRounds", totalRounds.toString());
      console.log(response.data);
      const rounddurationval = parseInt(response.data.roundDuration)
      setroundDuration(rounddurationval);
      setCountdown(rounddurationval);
      setCategories(categories);
      console.log("categories", response.data.categories);
      console.log("round duration", response.data.roundDuration);
      setSettingsLoaded(true);
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Handle error
    }
  }

  const sortPlayers = (playersData: { username: string }[]) => {
    const sortedUsernames = playersData.map((player) => player.username).sort();
    console.log("the usernames:",sortedUsernames);
    setPlayers(sortedUsernames);
  };

  const getPlayers = async () => {
    try {
      const response = await api.get(`/lobby/players/${lobbyId}`);
      sortPlayers(response.data);
    } catch (error) {
      console.log("Error fetching players");
    }
  };

  const handleRounds = async () => {
    const currRounds = parseInt(localStorage.getItem("currentRound"),10);
    console.log("current Round on the game screen:", currRounds);
    const next = currRounds + 1;
    localStorage.setItem("currentRound", next.toString());
    setRoundsHandled(true);
  }

  useEffect(() => {
    localStorage.setItem("answers", "false");
    getLetter();
    settings();
    getPlayers();
    handleRounds();
    setTimeout(startCountdown, 1); // Delay startCountdown by 1 second
  }, []);

  useEffect(() => {
    if (settingsLoaded && letterLoaded && positionLoaded) {
      setLoading(false); // Set loading to false when both settings and letter are loaded
    }
  }, [settingsLoaded, letterLoaded, positionLoaded]);


  const startCountdown = () => {
    // Start the countdown timer
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    setCountdownInterval(intervalId);
  };

  useEffect(() => {
    // Check if countdown has reached 0
    if (countdown === 0) {
      clearInterval(countdownInterval); // Stop the countdown timer
      // Perform actions when countdown reaches 0
      setInputDisabled(true);
      setShowStopPopup(true); // Show the popup when receiving the stop command
      setTimeout(() => {
        setShowStopPopup(false);
        setLoading(true); // Hide the popup after 4 seconds
      }, 5000);
      doStop();
    }
  }, [countdown]);

  const handleInputChange = (category: string, value: string) => {
    const truncatedValue = value.slice(0, 30);
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [category]: truncatedValue,
    }));
  };

  if (loading) {
    return (
      <div className="authentication container">
        <div className="authentication form">
          <CategoriesLoadingScreen />
        </div>
      </div>
    );
  }

  return (
    <BaseContainer>
      {/* Popup */}
      {showStopPopup && (
        <div className="game fullscreen-overlay">
          <div className="game popup">
            <p className="game stop-text">STOP</p>
          </div>
        </div>
      )}
      <div className="game container">
        <div className="game form">
          <div className="header">
            <h1 className="Letter">
              {letter} at {position} position{" "}
            </h1>
            <h1 className="countdown">{countdown}</h1>
          </div>
          {error && <div className="game error-message">{error}</div>}
          {categories.map((category, index) => (
            <FormField
              key={index}
              label={category}
              value={answers[category] || ""}
              onChange={(value: string) =>
                handleInputChange(category, value)
              }
              disabled={inputDisabled} 
            />
          ))}
        </div>
        <div className="game button-container">
          <Button
            disabled={categories.some((category) => !answers[category])}
            width="100%"
            onClick={() => webSocketService.sendMessage("/app/stop-game", {lobbyId: lobbyId})}
          >
            Stop
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Game;
