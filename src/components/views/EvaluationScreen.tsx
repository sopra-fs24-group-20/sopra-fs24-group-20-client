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

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">
      {user}
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
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const votes = {};

  const leaveLobby = async () => {
    try {
      await api.put(`/lobby/leave/${lobbyId}?username=${username}`);
      console.log("leave lobby success");
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("categoryIndex");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("roundDuration");
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
    const temporaryVotes = {"veto": false, "bonus": false};
    categories.forEach(category => {
      votes[category] = {}; // Initialize votes for each category
      players.forEach(name => {
        // Initialize each player's vote object with both bonus and veto keys
        votes[category][name] = {...temporaryVotes};
      });
    });
  }

  function changeCategory(allCategories) {
    if (!localStorage.getItem("categoryIndex")) {
      localStorage.setItem("categoryIndex","0");
    }
    setCurrentCategory(allCategories[parseInt(localStorage.getItem("categoryIndex"), 10)]);
  }

  const submitBonus =  (player:string) => {
    if (!localStorage.getItem("totalVotes")) {
      initiateVotes();
      localStorage.setItem("totalVotes",JSON.stringify(votes));
    }
    const temp = {...JSON.parse(localStorage.getItem("totalVotes"))};
    temp[currentCategory][player]["bonus"] = true;
    temp[currentCategory][player]["veto"] = false;
    console.log("When submitting a Bonus, our DT looks like this:",temp);
    localStorage.setItem("totalVotes",JSON.stringify(temp));
  };

  const submitVeto =  (player:string) => {
    if (!localStorage.getItem("totalVotes")) {
      initiateVotes();
      localStorage.setItem("totalVotes",JSON.stringify(votes));
    }
    const temp = {...JSON.parse(localStorage.getItem("totalVotes"))};
    temp[currentCategory][player]["veto"] = true;
    temp[currentCategory][player]["bonus"] = false;
    console.log("When submitting a Veto, our DT looks like this:",temp);
    localStorage.setItem("totalVotes",JSON.stringify(temp));
  };

  const nextEval = async () => {
    if (localStorage.getItem("categoryIndex")) {
      if (parseInt(localStorage.getItem("categoryIndex"), 10) < categories.length-1) {
        const newIndex = parseInt(localStorage.getItem("categoryIndex"), 10) + 1;
        localStorage.setItem("categoryIndex", newIndex.toString());

        if (!localStorage.getItem("totalVotes")) {
          initiateVotes();
          localStorage.setItem("totalVotes",JSON.stringify(votes));
        }
        console.log("My totalVotes before navigating to the next Screen:",JSON.parse(localStorage.getItem("totalVotes")));
        navigate(`/evaluation/${lobbyName}/${categories[newIndex]}`);
      }
      else {
        if (!localStorage.getItem("totalVotes")) {
          initiateVotes();
          localStorage.setItem("totalVotes",JSON.stringify(votes));
        }
        localStorage.removeItem("categoryIndex");
        const temp = JSON.parse(localStorage.getItem("totalVotes"));
        console.log("My final votes which get send to the backend:",temp);
        localStorage.removeItem("totalVotes");
        try {
          const requestBody = JSON.stringify(temp);
          console.log("requestBody",requestBody);
          const response = await api.post(`/rounds/${gameId}/submitVotes`, requestBody);
        } catch (error) {
          console.error(
            `An error occurred while trying submit the votes: \n${handleError(error)}`
          );
        }
        if (!localStorage.getItem("round")) {
          localStorage.setItem("round","1");
        }
        setCurrentRound(localStorage.getItem("round"));
        if (currentRound < rounds) {
          localStorage.setItem("round", JSON.stringify(currentRound + 1));
          navigate(`/leaderboard/${lobbyName}`);
        }
        localStorage.removeItem("round");
        navigate(`/leaderboard/final/${lobbyName}`);
      }
    }
    else {
      navigate("/start");
    }
  }


  useEffect(() => {
    async function fetchData() {
      try {
        // setLoading(true);
        const response = await api.get(`/rounds/scores/${gameId}`,gameId);
        const fetchedPlayers = getPlayerNames(response.data);
        const fetchedCategories = getCategories(response.data);
        setPlayers(fetchedPlayers);
        setCategories(fetchedCategories);
        changeCategory(fetchedCategories);
        setAnswers(getPlayerAnswersForCategory(response.data,currentCategory));
        setScores(getScoresForCategory(response.data,currentCategory));
      } catch (error) {
        console.error(
          `Something went wrong while fetching the players: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the players! See the console for details."
        );
      } finally {
        // setLoading(false);
      }
    }
    async function fetchRounds() {
      try {
        // setLoading(true);
        const response = await api.get(`lobby/settings/${lobbyId}`);
        setRounds(response.data.rounds);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the settings: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the settings! See the console for details."
        );
      } finally {
        // setLoading(false);
      }
    }
    fetchData();
    fetchRounds();
  }, [gameId, currentCategory, setPlayers, setCategories, setAnswers, setScores,categories]);

  /* if (true) {
    return (
      <BaseContainer>
        <div className="authentication container">
          <div className="authentication form">
            <CategoriesLoadingScreen />
          </div>
        </div>
      </BaseContainer>
    );
  }*/ 

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
                      width="40%"
                      onClick={() => leaveLobby()}
                    >
                      Exit
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
                        <div className="evaluation score">{scores[index]}pt</div>
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
            <div className="evaluation right axis">
              <div className="evaluation button-container-bottom">
                <Button
                  className="secondary-button"
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => nextEval()}
                >
                  Finish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>)}

export default EvaluationScreen;
