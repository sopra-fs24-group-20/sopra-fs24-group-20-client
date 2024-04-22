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
  const LobbyName = localStorage.getItem("lobbyName");
  const LobbyId = localStorage.getItem("lobbyId");
  const LobbyPassword = localStorage.getItem("lobbyPassword");
  const [players, setPlayers] = useState<User[]>(null);
  const [categories, setCategories] = useState<String[]>(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [nextCategory, setNextCategory] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [currentRound, setCurrentRound] = useState(null);
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


  const handleClick = () => {
    const requestBody = JSON.stringify({
      lobbyName: LobbyName,
      lobbyId: LobbyId,
      username: username
    });
    leaveLobby(requestBody)
  };

  const nextEval = () => {
    if (!localStorage.getItem("currentRound")) {
      setCurrentRound(1);
      localStorage.setItem("currentRound", currentRound);
    }
    if (localStorage.getItem("currentCategory")) {
      setCurrentCategory(localStorage.getItem("currentCategory"));
      const index = categories.indexOf(currentCategory);
      if (index !== -1 && index < categories.length - 1) {
        setNextCategory(categories[index + 1]);
        localStorage.setItem("currentCategory",nextCategory);
      }
      else {
        if (currentRound === rounds) {
          localStorage.removeItem("currentRound");
          localStorage.removeItem("currentCategory");
          navigate("/finalLeader");
        }
        else {
          localStorage.setItem("currentRound", currentRound + 1);
          navigate("/currentLeader");
        }
      }
    }
    else {
      setCurrentCategory(categories[0]);
      localStorage.setItem("currentCategory", currentCategory);
    }
    navigate(`/evaluation/${currentCategory}`);
  }



  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/lobby/players", LobbyName);
        setPlayers(response.data);

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
    async function fetchCategories() {
      try {
        const response = await api.get("/lobby/settings", LobbyName);
        setCategories(response.data.categories);
        setRounds(response.data.rounds);
      }catch (error) {
        console.error(
          `Something went wrong while fetching the categories: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the categories! See the console for details."
        );
      }
    }
    fetchData();
    fetchCategories();
  }, [LobbyName]);

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
              <ul className="evaluation ul">
                <li className="evaluation li">players</li>
              </ul>
            </div>

            <div className="evaluation middle-left-axis">
              {currentCategory}{/*to be added*/}
            </div>

            <div className="evaluation middle-axis">
              Bonus
            </div>

            <div className="evaluation middle-right-axis">
              Veto
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
