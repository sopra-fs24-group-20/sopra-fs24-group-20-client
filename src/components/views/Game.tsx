import React, { useEffect, useState } from "react";
import { api, handleError, client } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

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
  const [countdown, setCountdown] = useState<number>(parseInt(localStorage.getItem("roundDuration"))); 
  const [countdownInterval, setCountdownInterval] = useState<any>(null); // State variable for interval ID
  const lobbyName = localStorage.getItem("lobbyName");
  const username = localStorage.getItem("username");
  const gameId = localStorage.getItem("gameId");
  const lobbyId = localStorage.getItem("lobbyId");
  const roundDuration = localStorage.getItem("roundDuration");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [celebrity, setCelebrity] = useState<string>("");
  const [error, setError] = useState(null);
  const ws = localStorage.getItem("gamews");
  const [formatedData,setFormatedData] = useState<string>("");

  useEffect(() => {
    if (ws === "false") {
      window.location.reload();
      localStorage.setItem("gamews", JSON.stringify(true))
    }
  }, [ws]);


  useEffect(() => {
    async function stompConnect() {
      try {
        if (!client["connected"]) {
          client.connect({}, function () {
            client.send("/app/connect", {}, JSON.stringify({ username: username }));
            client.subscribe("/topic/game-control", function (response) {
              const data = JSON.parse(response.body);
              if (data.command === "stop") {
                setCountdown(0);
              }
            });
          });
        }
      } catch (error) {
        console.error(`Something went wrong: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong! See the console for details.");
      }
    }
    stompConnect();
    
  }, []);

  useEffect(() => {
    // Fetch settings before the game starts
    async function fetchSettings() {
      try {
        const response = await api.get(`/lobby/settings/${lobbyId}`);
        const categories = response.data.categories;
        console.log("categories", response.data.categories);
        // Handle response and set state accordingly
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Handle error
      }
    }

    fetchSettings();
  }, []);

  const getFormattedData = (category1: string, category2: string, category3: string, category4: string, answer1: string, answer2: string, answer3: string, answer4: string, username: string) => {
    const data = {
      username: username,
      [category1]: answer1,
      [category2]: answer2,
      [category3]: answer3,
      [category4]: answer4
    };

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


  const doStop = async () => {
    if (client && client["connected"]) {
      client.disconnect(function () {
        console.log("disconnected from stomp");
      });
    }
    clearInterval(countdownInterval); // Stop the countdown timer
    console.log("co", country);
    console.log("ci", city);
    console.log("pro", profession);
    console.log("cel", celebrity);
    
    const answer = getFormattedData("country", "city", "profession", "celebrity", country, city, profession, celebrity, username);

    // send the answers to backend for verification
    try{
      await submitAnswers(answer);
    }catch(error){
      setError("Error submitting data");

      return;
    }
    localStorage.removeItem("alreadySet");
    localStorage.setItem("gamews", JSON.stringify(false))
    navigate(`/evaluation/${lobbyName}/profession`);
  };

  const StopGame = async () => {
    client.send("/app/stop-game", {}, "{}");
    doStop();
  };

  const getLetter = async () => {
    try {
      await api.put(`/players/${username}`, JSON.stringify({ready: false}));
      const response = await api.get(`/rounds/letters/${gameId}`);
      setLetter(response.data);
    } catch (error) {
      console.log("Error fetching the current letter");
    }
  };

  useEffect(() => {
    getLetter();
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
      doStop();
    }
  }, [countdown]);

  return (
    <BaseContainer>
      <div className="game container">
        <div className="game form">
          <div className="header">
            <h1 className="Letter">{letter}</h1>
            <h1 className="countdown">{countdown}</h1>
          </div>
          {error && <div className="game error-message">{error}</div>}
          <FormField
              label="country"
              value={country}
              onChange={(country: string) => {
                console.log('Country changed:', country);
                setCountry(country);
              }}
            />

            <FormField
              label="city"
              value={city}
              onChange={(city: string) => {
                console.log('City changed:', city);
                setCity(city);
              }}
            />

            <FormField
              label="profession"
              value={profession}
              onChange={(profession: string) => {
                console.log('Profession changed:', profession);
                setProfession(profession);
              }}
            />

            <FormField
              label="celebrity"
              value={celebrity}
              onChange={(celebrity: string) => {
                console.log('Celebrity changed:', celebrity);
                setCelebrity(celebrity);
              }}
            />
        </div>
        <div className="game button-container">
          <Button
            disabled={!country || !city || !profession || !celebrity}
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
