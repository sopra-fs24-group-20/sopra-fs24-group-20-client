import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Evaluation.scss";
import { User } from "types";
import PropTypes from "prop-types";
import "styles/views/Authentication.scss";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
import webSocketService from "helpers/websocketContext";
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
  <div>
    <div className="player username">
      {user}
    </div>
    <div className="player container">
      <object type="image/svg+xml" data={hashUsername(user)}></object>
    </div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const EvaluationScreen = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const lobbyName = localStorage.getItem("lobbyName");
  const lobbyId = localStorage.getItem("lobbyId");
  const gameId = localStorage.getItem("gameId");
  const [players, setPlayers] = useState<User[]>(null);
  const [categories, setCategories] = useState<String[]>(null);
  const [answers, setAnswers] = useState<String[]>(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [scores, setScores] = useState<number[]>(null);
  const [rounds, setRounds] = useState<number>(1);
  const [currentRound, setCurrentRound] = useState(null);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [votes, setVotes] = useState({});
  const [disableButton, setDisableButton] = useState<boolean>(false);

  useEffect(() => {

    async function fetchData() {
      try {
        const response = await api.get(`/rounds/scores/${gameId}`);
        const second_response = await api.get(`/lobby/settings/${lobbyId}`);
        const fetchedCategories = getCategories(response.data);
        const fetchedPlayers = getPlayerNames(response.data);
        const fetchedRounds = second_response.data.rounds;
        console.log("lobby settings", second_response.data);
        console.log("rounds fetched", second_response.data.rounds);

        setFetchedData(response.data);
        setCategories(fetchedCategories);
        setPlayers(fetchedPlayers);
        setRounds(second_response.data.rounds);

        // Set the current category to the first category
        setCurrentCategory(fetchedCategories[0]);

        setAnswers(getPlayerAnswersForCategory(response.data, fetchedCategories[0]));
        setScores(getScoresForCategory(response.data, fetchedCategories[0]));
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
        setLoading(false);
      }
    }

    fetchData();
    
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
        "/topic/answers-count",
        async (message) => {
          const messageData = JSON.parse(message.body);
          console.log("Received messageData:", messageData);
          console.log("message.command:", message.command);
          if (messageData.command === "done" && messageData.lobbyId.toString() === lobbyId) {
            console.log("received final scores");
            // idk something to handle when all players are done evaluating
            const totalRounds = parseInt(localStorage.getItem("totalRounds"),10);
            const currRound = parseInt(localStorage.getItem("currentRound"),10);
            console.log("the total round count on the eval screen:", totalRounds);
            console.log("the current round count on the eval screen:", currRound);
      
            if (currRound < totalRounds) {
              setLoading(false);
              navigate(`/leaderboard/${lobbyName}`);
            }
            else {
              localStorage.removeItem("totalRounds");
              localStorage.removeItem("currentRound");
              setLoading(false);
              navigate(`/leaderboard/final/${lobbyName}`);
            }
          } 
        },
        { lobbyId: lobbyId, username: username}
      );
      
      return () => {

        webSocketService.unsubscribe("/topic/answers-count");
      };
    };
  
    subscribeToWebSocket();

    return () => {
      webSocketService.unsubscribe("/topic/answers-count");
    }
    
  }, []);

  const leaveLobby = async () => {
    try {
      if (webSocketService.connected){
        webSocketService.sendMessage("/app/leave", { username: username , lobbyId: lobbyId });
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await webSocketService.disconnect();
      }
      await api.put(`/lobby/leave/${lobbyId}?username=${username}`);
      console.log("leave lobby success");
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("categoryIndex");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("roundDuration");
      localStorage.removeItem("currentRound");
      navigate(`/user/${username}`);
    } catch (error) {
      if (error.response.status === 404){
        console.log("Lobby doesn't exist");
        navigate(`/user/${username}`);
      }
      console.error(
        `An error occurred while trying to exit the lobby: \n${handleError(error)}`
      );
    }
  };

  function getCategories(playersAnswers) {
    return Object.keys(playersAnswers);
  }

  function getPlayerNames(playersAnswers) {
    const categories = Object.keys(playersAnswers);

    return Object.keys(playersAnswers[categories[0]]);
  }

  function getScoresForCategory(playersAnswers,category) {
    const playerAnswersList = [];
    for (const playerName in playersAnswers[Object.keys(playersAnswers)[0]]) {
      if (playersAnswers.hasOwnProperty(category)) {
        playerAnswersList.push(playersAnswers[category][playerName].score);
      }
    }

    return playerAnswersList;
  }

  function getPlayerAnswersForCategory(playersAnswers, category) {
    const playerAnswersList = [];
    for (const playerName in playersAnswers[Object.keys(playersAnswers)[0]]) {
      if (playersAnswers.hasOwnProperty(category)) {
        playerAnswersList.push(playersAnswers[category][playerName].answer);
      }
    }

    return playerAnswersList;
  }

  function initiateVotes() {
    const temporaryVotes = { veto: false, bonus: false };
    const newVotes = {};
    categories.forEach((category) => {
      newVotes[category] = {}; // Initialize votes for each category
      players.forEach((name) => {
        // Initialize each player's vote object with both bonus and veto keys
        newVotes[category][name] = { ...temporaryVotes };
      });
    });
    setVotes(newVotes); // Update the votes state with the new votes object
    setInitiated(true); // Set initiated to true after votes initialization
  }

  function changeCategory(allCategories) {
    if (!localStorage.getItem("categoryIndex")) {
      localStorage.setItem("categoryIndex","0");
    }
    setCurrentCategory(allCategories[parseInt(localStorage.getItem("categoryIndex"), 10)]);
  }

  const submitBonus = (player: string) => {
    console.log("bonus accessed");
    if (!initiated) {
      initiateVotes();
    }
    setVotes((prevVotes) => ({
      ...prevVotes,
      [currentCategory]: {
        ...(prevVotes[currentCategory] || {}),
        [player]: { ...(prevVotes[currentCategory]?.[player] || {}), bonus: true },
      },
    }));
    console.log("When submitting a Bonus, our DT looks like this:", votes);
  };

  const submitVeto = (player: string) => {
    console.log("veto accessed");
    if (!initiated) {
      initiateVotes();
    }
    setVotes((prevVotes) => ({
      ...prevVotes,
      [currentCategory]: {
        ...(prevVotes[currentCategory] || {}),
        [player]: { ...(prevVotes[currentCategory]?.[player] || {}), veto: true },
      },
    }));
    console.log("When submitting a Veto, our DT looks like this:", votes);
  };

  const nextEval = async () => {
    if (displayIndex === categories.length - 1) {
      setDisableButton(true);
    }
    if (displayIndex < categories.length - 1) {
      setDisplayIndex(displayIndex + 1);

      if (Object.keys(votes).length === 0) {
        initiateVotes();
      }

      console.log("My totalVotes before navigating to the next Screen:", votes);

    }
    else {

      if (Object.keys(votes).length === 0) {
        initiateVotes();
        
      }

      console.log("My final votes which get send to the backend:", votes);

      try {
        setLoading(true);
        const requestBody = JSON.stringify(votes);
        console.log("requestBody", requestBody);
        const response = await api.post(`/rounds/${gameId}/submitVotes`, requestBody);
        webSocketService.sendMessage("/app/answers-submitted", {username: username, lobbyId: lobbyId})
      } catch (error) {
        console.error(`An error occurred while trying submit the votes: \n${handleError(error)}`);
      }

    }
  };


  useEffect(() => {
    if (fetchedData && currentCategory) {
      // Update answers and scores when currentCategory changes
      setAnswers(getPlayerAnswersForCategory(fetchedData, currentCategory));
      setScores(getScoresForCategory(fetchedData, currentCategory));
    }
  }, [currentCategory, fetchedData]);

  useEffect(() => {
    // Update current category when display index changes
    if (categories) {
      setCurrentCategory(categories[displayIndex]);
    }
  }, [displayIndex, categories]);

  useEffect(() => {
    // Update answers and scores when display index changes
    if (fetchedData) {
      setAnswers(getPlayerAnswersForCategory(fetchedData, currentCategory));
      setScores(getScoresForCategory(fetchedData, currentCategory));
    }
  }, [displayIndex]);

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
      <div className="evaluation container">
        <div className="evaluation form-container">
          <div className="evaluation form-left">
            <div className="evaluation left-axis">
              <div>
                <p>
                  <div className="evaluation button-container">
                    <Button
                      className="secondary-button"
                      width="fit-content"
                      onClick={() => leaveLobby()}
                    >
                      Exit Lobby
                    </Button>
                  </div>
                </p>
              </div>
              <div className="evaluation transparent-form-exception">
                <ul className="evaluation ul">
                  {players?.map((player, index) => (
                    <li key={index} className="evaluation li">
                      <Player user={player} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="evaluation middle-left-axis">
              <h1>{currentCategory}</h1>
              <div className="evaluation transparent-form-normal">
                <ul className="evaluation ul">
                  {answers?.map((answer, index) => (
                    <li key={index} className="evaluation li">
                      <div className="evaluation answer">{answer}
                        <div className="evaluation score">
                          {scores[index] === 1 ? (
                            <span style={{ color: "green" }}>✔</span>
                          ) : (
                            <span style={{ color: "red" }}>✘</span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="evaluation middle-axis">
              Veto
              {players?.map((player, index) => (
                <button
                  key={index}
                  className="round-button-red"
                  style={{ marginTop: index === 0 ? "36px" : 0 }}
                  onClick={() => submitVeto(players[index])}
                  disabled={username === player}
                ></button>
              ))}
            </div>

            <div className="evaluation middle-right-axis">
              Bonus
              {players?.map((player, index) => (
                <button
                  key={index}
                  className="round-button-green"
                  style={{ marginTop: index === 0 ? "36px" : 0 }}
                  onClick={() => submitBonus(players[index])}
                  disabled={username === player}
                ></button>
              ))}
            </div>
          </div>
          <div className="evaluation form-right">
            <div className="evaluation button-container-bottom">
              <Button
                className="secondary-button"
                style={{ width: "100%", height: "100%" }}
                onClick={() => nextEval()}
                disabled={disableButton}
              >
                {displayIndex < categories.length - 1 ? "Next" : "Finish"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>)
}

export default EvaluationScreen;
