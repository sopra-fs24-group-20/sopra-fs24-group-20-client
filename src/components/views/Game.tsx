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
  const [country, setCountry] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [profession, setProfession] = useState<string>("");
  const [celebrity, setCelebrity] = useState<string>("");
  const [error, setError] = useState(null);

  const doStop = async () => {
    clearInterval(countdownInterval); // Stop the countdown timer
    // send something to backend so game stops for everyone
    // send the answers to backend for verification
    navigate("/evaluation");
  };

  useEffect(() => {
    getLetter();
    // Start countdown after 60 seconds
    setTimeout(startCountdown, 1); // Delay startCountdown by 60 seconds
  }, []);

  const getLetter = async () => {
    try {
      const response = await api.get(`/round/${lobbyName}/letters`);
      setLetter(response.data);
    } catch (error) {
      console.log("Error fetching the current letter");
    }
  };

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
