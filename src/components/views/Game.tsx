import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

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
  const [letter, setLetter] = useState<string>("A");
  const [countdown, setCountdown] = useState<number>(60); // Initial countdown value set to 60 seconds
  const [countdownInterval, setCountdownInterval] = useState<any>(null); // State variable for interval ID
  const lobbyName = localStorage.getItem("lobbyName");
  const username = localStorage.getItem("username");
  const gameId = localStorage.getItem("gameId");
  const lobbyId = localStorage.getItem("lobbyId");
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [celebrity, setCelebrity] = useState<string>("");
  const [error, setError] = useState(null);

  const getFormattedData = (category: string, username: string, answer: string) => {
    const data = {
      Round:1,
      Category: category,
      [username]: answer
    };
    return JSON.stringify(data);
  };

  const submitAnswers = async (category, data) =>{
    try{
      await api.put(`/round/${gameId}/entries`, data);
    }catch(error){
      throw new Error(`Error submitting ${category} data`)
    }
  };

  const doStop = async () => {
    clearInterval(countdownInterval); // Stop the countdown timer
    // send something to backend so game stops for everyone with websocket stuff


    const countryans = getFormattedData("country", username, country);
    const cityans = getFormattedData("city", username, city);
    const professionans = getFormattedData("profession", username, profession);
    const celebrityans = getFormattedData("celebrity", username, celebrity);
    // send the answers to backend for verification
    try{
      await submitAnswers("country", countryans);
      await submitAnswers("city", cityans);
      await submitAnswers("profession", professionans);
      await submitAnswers("celebrity", celebrityans);
    }catch(error){
      setError("Error submitting data");
      return;
    }
    navigate(`/leaderboard/final/${lobbyName}`);
  };

  const getLetter = async () => {
    try {
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
      // Example: doStop()
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
            onChange={(co: string) => setCountry(co)}
          />
          <FormField
            label="city"
            value={city}
            onChange={(ci: string) => setCity(ci)}
          />
          <FormField
            label="profession"
            value={profession}
            onChange={(pr: string) => setProfession(pr)}
          />
          <FormField
            label="celebrity"
            value={celebrity}
            onChange={(ce: string) => setCelebrity(ce)}
          />
        </div>
        <div className="game button-container">
          <Button
            disabled={!country || !city || !profession || !celebrity}
            width="100%"
            onClick={() => doStop()}
          >
            Stop
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Game;
