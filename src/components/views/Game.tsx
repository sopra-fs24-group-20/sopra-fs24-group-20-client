import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import webSocketService from "helpers/websocketContext";

const FormField = (props) => {
  return (
    <div className="game field">
      <label className="game label">{props.label}</label>
      <input
        className="game input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
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
  const[position, setPosition] = useState<string>("");
  
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
  
      const subscription = webSocketService.subscribe(
        "/topic/game-control",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log("Received messageData:", messageData);
          console.log("message.command:", message.command);
          if (messageData.command === "stop" && messageData.lobbyId.toString() === lobbyId) {
            console.log("received stop");
            const answer = getFormattedData();
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            await doStop(answer);
          } 
        },
        { lobbyId: lobbyId }
      );
      
      return () => {
        webSocketService.unsubscribe(subscription);
      };
    };
  
    subscribeToWebSocket();
    
  }, []);
  
  


  useEffect(() => {
    // Fetch settings before the game starts
    async function fetchSettings() {
      try {
        const response = await api.get(`/lobby/settings/${lobbyId}`);
        console.log(gameId);
        const categories = response.data.categories;
        console.log(response.data);
        const rounddurationval = parseInt(response.data.roundDuration)
        setroundDuration(rounddurationval);
        setCountdown(rounddurationval);
        setCategories(categories);
        console.log("categories", response.data.categories);
        console.log("round duration", response.data.roundDuration);
        
      } catch (error) {
        console.error("Error fetching settings:", error);
        // Handle error
      }
    }

    fetchSettings();
  }, []);

  const getFormattedData = () => {
    const data: { [key: string]: string } = { username };
    categories.forEach((category, index) => {
      data[category] = answers[category] || "";
    });
    console.log(JSON.stringify(data));

    return JSON.stringify(data);
  };

  const submitAnswers = async (data) =>{
    console.log("submit answers ", data);
    try{
      await api.post(`/rounds/${gameId}/entries`, data);

    }catch(error){
      throw new Error("Error submitting data")
    }
  };


  const doStop = async (answer) => {
    console.log("in dostop");
    await api.put(`/players/${username}`, JSON.stringify({ready: false}));
    console.log("put ready to false");
    clearInterval(countdownInterval); // Stop the countdown timer
    console.log("cleared timer");
    
    console.log("got formatted data");
    // send the answers to backend for verification
    try{
      await submitAnswers(answer);
      console.log("submitted answers");
    }catch(error){
      setError("Error submitting data");

      return;
    }
    const response = await api.get(`/rounds/scores/${gameId}`);
    const categoriesObject = response.data;
    const firstCategory = Object.keys(categoriesObject)[0];
    console.log(firstCategory);
    localStorage.setItem("gamews", "false");
    navigate(`/evaluation/${lobbyName}/${firstCategory}`);
  };

  const StopGame = async () => {
    webSocketService.sendMessage("/app/stop-game", {lobbyId: lobbyId});
    const answer = getFormattedData();
    doStop(answer);
  };

  const getLetter = async () => {
    try {
      // await api.put(`/players/${username}`, JSON.stringify({ready: false}));
      const response = await api.get(`/rounds/letters/${gameId}`);
      setLetter(response.data);
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
    }catch (error) {
      console.log("Error fetching the current letter");
    }
  };

  const settings = async() => {
    try {
      const response = await api.get(`/lobby/settings/${lobbyId}`);
      console.log(gameId);
      const categories = response.data.categories;
      console.log(response.data);
      const rounddurationval = parseInt(response.data.roundDuration)
      setroundDuration(rounddurationval);
      setCountdown(rounddurationval);
      setCategories(categories);
      console.log("categories", response.data.categories);
      console.log("round duration", response.data.roundDuration);
      
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Handle error
    }
  }

  useEffect(() => {
    getLetter();
    settings();
    setTimeout(startCountdown, 1); // Delay startCountdown by 1 second
  }, []);


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
      const answer = getFormattedData();
      doStop(answer);
    }
  }, [countdown]);

  const handleInputChange = (category: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [category]: value,
    }));
  };

  return (
    <BaseContainer>
      <div className="game container">
        <div className="game form">
          <div className="header">
            <h1 className="Letter">{letter} at position {position}</h1>
            <h1 className="countdown">{countdown}</h1>
          </div>
          {error && <div className="game error-message">{error}</div>}
          {categories.map((category, index) => (
            <FormField
              key={index}
              label={category}
              value={answers[category] || ""}
              onChange={(value: string) => handleInputChange(category, value)}
            />
          ))}
        </div>
        <div className="game button-container">
          <Button
            disabled={categories.some((category) => !answers[category])}
            width="100%"
            onClick={() => StopGame()}
          >
            Stop
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Game;
