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
  const [displayIndex, setDisplayIndex] = useState(0);
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initiated, setInitiated] = useState<boolean>(false);
  const [votes, setVotes] = useState({});

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
    if (displayIndex < categories.length - 1) {
      setDisplayIndex(displayIndex + 1);

      if (Object.keys(votes).length === 0) {
        initiateVotes();
      }

      console.log("My totalVotes before navigating to the next Screen:", votes);

    } else {

      if (Object.keys(votes).length === 0) {
        initiateVotes();
      }

      console.log("My final votes which get send to the backend:", votes);

      try {
        const requestBody = JSON.stringify(votes);
        console.log("requestBody", requestBody);
        const response = await api.post(`/rounds/${gameId}/submitVotes`, requestBody);
      } catch (error) {
        console.error(`An error occurred while trying submit the votes: \n${handleError(error)}`);
      }

      if (!localStorage.getItem("round")) {
        localStorage.setItem("round", "1");
      }
      setCurrentRound(localStorage.getItem("round"));

      if (currentRound < rounds) {
        localStorage.setItem("round", JSON.stringify(currentRound + 1));
        navigate(`/leaderboard/${lobbyName}`);
      }
      localStorage.removeItem("round");
      navigate(`/leaderboard/final/${lobbyName}`);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/rounds/scores/${gameId}`, gameId);
        const fetchedCategories = getCategories(response.data);
        const fetchedPlayers = getPlayerNames(response.data);
        const fetchedRounds = response.data.rounds;

        setFetchedData(response.data);
        setCategories(fetchedCategories);
        setPlayers(fetchedPlayers);
        setRounds(fetchedRounds);

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
  }, [gameId]);

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
