import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Evaluation.scss";
import { User } from "types";

const EvaluationScreen = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const username = localStorage.getItem("username");
  const lobbyName = localStorage.getItem("lobbyName");
  const lobbyId = localStorage.getItem("lobbyId");
  const gameId = localStorage.getItem("gameId");
  const LobbyPassword = localStorage.getItem("lobbyPassword");
  const [players, setPlayers] = useState<User[]>(null);
  const [categories, setCategories] = useState<String[]>(null);
  const [answers, setAnswers] = useState<String[]>(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [nextCategory, setNextCategory] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);

  const mockAnswersOne = {"One" : "Dublin", "Two": "Dusseldorf"};
  const mockAnswersTwo =  {"One": "Denmark", "Two": "Denmark"};
  const mockPlayersAnswers = {"City": mockAnswersOne, "Country": mockAnswersTwo};

  const leaveLobby = async (requestBody: string) => {
    if (requestBody === null){
      console.log("no existing lobby")
      navigate(`/profile/${username}`);
    }
    try {
      const response = await api.post("/lobby/leave", requestBody);
      console.log("leave lobby success");
      localStorage.removeItem("lobbyName");
      localStorage.removeItem("lobbyPassword");
      localStorage.removeItem("currentCategory");
      localStorage.removeItem("nextCategory");
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

  function getPlayerAnswersForCategory(playersAnswers, category) {
    const playerAnswersList = [];
    for (const playerName in playersAnswers[Object.keys(playersAnswers)[0]]) {
      if (playersAnswers.hasOwnProperty(category)) {
        playerAnswersList.push(playersAnswers[category][playerName]);
      }
    }

    return playerAnswersList;
  }

  function changeCategory() {
    if (localStorage.getItem("nextCategory")) {
      setCurrentCategory(localStorage.getItem("nextCategory"));
      const index = categories.indexOf(currentCategory);
      if (index !== -1 && index < categories.length - 1) {
        setNextCategory(categories[index + 1]);
        localStorage.setItem("nextCategory",nextCategory);
      }
      else {
        localStorage.removeItem("nextCategory");
      }
    }
    else {
      localStorage.setItem("currentCategory",categories[0]);
      setCurrentCategory(categories[0]);
      if (categories.length > 1) {
        localStorage.setItem("nextCategory",categories[1]);
      }
    }
  }

  const mockAnswers = getPlayerAnswersForCategory(mockPlayersAnswers,"City");
  const mockCategories = getCategories(mockPlayersAnswers);
  const mockPlayers = getPlayerNames(mockPlayersAnswers);

  const handleClick = () => {
    const requestBody = JSON.stringify({
      lobbyName: lobbyName,
      lobbyId: lobbyId,
      username: username
    });
    leaveLobby(requestBody)
  };

  const nextEval = () => {
    if (localStorage.getItem("nextCategory")) {
      navigate(`/evaluation/${lobbyName}/${nextCategory}`);
    }
    else {
      navigate(`/leaderboard/final/${lobbyName}`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/round/scores/${gameId}`, gameId);
        setPlayers(getPlayerNames(response.data));
        setCategories(getCategories(response.data));
        changeCategory();
        setAnswers(getPlayerAnswersForCategory(response.data,currentCategory));

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
  }, [gameId]);

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
                  {mockPlayers.map((player, index) => (
                    <li key={index} className="evaluation li">{player}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="evaluation middle-left-axis">
              {currentCategory}
              <div className="evaluation transparent-form-normal">
                <ul className="evaluation ul">
                  {mockAnswers.map((answer, index) => (
                    <li key={index} className="evaluation li">{answer}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="evaluation middle-axis">
              Bonus
              {mockPlayers.map((_, index) => (
                <button
                  key={index}
                  className="round-button-green"
                  style={{ marginTop: index === 0 ? "60px" : 0 }}
                ></button>
              ))}
            </div>

            <div className="evaluation middle-right-axis">
              Veto
              {mockPlayers.map((_, index) => (
                <button
                  key={index}
                  className="round-button-red"
                  style={{ marginTop: index === 0 ? "60px" : 0 }}
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
