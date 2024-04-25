import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Evaluation.scss";
import { User } from "types";

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

  const leaveLobby = async (requestBody: string) => {
    if (requestBody === null){
      console.log("no existing lobby")
      navigate(`/profile/${username}`);
    }
    try {
      const response = await api.post("/lobby/leave", requestBody);
      console.log("leave lobby success");
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("currentCategory");
      localStorage.removeItem("nextCategory");
      localStorage.removeItem("lobbyId");
      localStorage.removeItem("gameId");
      localStorage.removeItem("roundDuration");
      navigate(`/profile/${username}`);
    } catch (error) {
      if (error.response.status === 404){
        console.log("Lobby doesn't exist");
        navigate(`/profile/${username}`);
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

  function changeCategory(allCategories) {
    if (!localStorage.getItem("categoryIndex")) {
      localStorage.setItem("categoryIndex","0");
    }
    setCurrentCategory(allCategories[parseInt(localStorage.getItem("categoryIndex"), 10)]);
  }

  const handleClick = () => {
    const requestBody = JSON.stringify({
      lobbyName: lobbyName,
      lobbyId: lobbyId,
      username: username
    });
    leaveLobby(requestBody)
  };

  const nextEval = () => {
    if (localStorage.getItem("categoryIndex")) {
      if (parseInt(localStorage.getItem("categoryIndex"), 10) < categories.length-1) {
        const newIndex = parseInt(localStorage.getItem("categoryIndex"), 10) + 1;
        localStorage.setItem("categoryIndex", newIndex.toString());
        console.log(localStorage.getItem("categoryIndex"));
        navigate(`/evaluation/${lobbyName}/${categories[newIndex]}`);
      }
      else {
        localStorage.removeItem("categoryIndex");
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
      }
    }
    fetchData();
  }, [gameId, currentCategory, setPlayers, setCategories, setAnswers, setScores,categories]);

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
                      width="60%"
                      onClick={() => handleClick()}
                    >
                      Exit
                    </Button>
                  </div>
                </p>
              </div>
              <div className="evaluation transparent-form-exception">
                <ul className="evaluation ul">
                  {players?.map((player, index) => (
                    <li key={index} className="evaluation li">{player}</li>
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
                      {answer}   -   {scores[index]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="evaluation middle-axis">
              Bonus
              {players?.map((_, index) => (
                <button
                  key={index}
                  className="round-button-green"
                  style={{ marginTop: index === 0 ? "39px" : 0 }}
                ></button>
              ))}
            </div>

            <div className="evaluation middle-right-axis">
              Veto
              {players?.map((_, index) => (
                <button
                  key={index}
                  className="round-button-red"
                  style={{ marginTop: index === 0 ? "39px" : 0 }}
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
