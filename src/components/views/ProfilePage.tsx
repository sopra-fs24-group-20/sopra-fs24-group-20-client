import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import { User } from "types";
import "styles/views/Authentication.scss";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

const ProfilePage = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPoints, setTotalPoints] = useState<number>(null);
  const [level, setLevel] = useState(null);
  const [roundsPlayed, setRoundsPlayed] = useState(null);
  const [averagePointsPerRound, setAveragePointsPerRound] = useState(null);
  const [victories, setVictories] = useState(null)
  const [username,setUsername] = useState<string>(null);

  const logout = async () => {
    try {
      setLoading(true);
      const response = await api.post("players/logout",{username});
      localStorage.clear();
      navigate("/start");
    } catch (error) {
      console.error(
        `An error occurred while trying to exit the lobby: \n${handleError(error)}`
      );
    } finally {
      setLoading(false);
    }
  };


  const handleClick = () => {
    logout()
  };


  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await api.get(`/players/${localStorage.getItem("username")}`);
        setUser(response.data);
        setLevel(response.data.level);
        setAveragePointsPerRound(response.data.averagePointsPerRound);
        setVictories(response.data.victories);
        setTotalPoints(response.data.totalPoints);
        setRoundsPlayed(response.data.roundsPlayed);
        setUsername(response.data.username);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [localStorage.getItem("username")]);

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
      <div className="profile container">
        <div className="profile form">
          <div className="profile left-axis">
            <h1 className="profile top-text">{username && username.replace(/^Guest:/, "")}</h1>
            <div>
              <p>
                <a className="profile link" href="#" onClick={handleClick}>logout</a>
              </p>
            </div>
          </div>

          <div className="profile right-axis">
            {username && !username.startsWith("Guest:") ? (
              <>
                <div className="profile stat-container">
                  <div className="profile stat-category">Level:</div>
                  <div className="profile stat-value">{level}</div>
                </div>
                <div className="profile stat-container">
                  <div className="profile stat-category">Rounds Played:</div>
                  <div className="profile stat-value">{roundsPlayed}</div>
                </div>
                <div className="profile stat-container">
                  <div className="profile stat-category">Total Points:</div>
                  <div className="profile stat-value">{totalPoints}</div>
                </div>
                <div className="profile stat-container">
                  <div className="profile stat-category">⌀ points per round:</div>
                  <div className="profile stat-value">{averagePointsPerRound}</div>
                </div>
                <div className="profile stat-container" style={{marginBottom: "60px"}}>
                  <div className="profile stat-category">Victories:</div>
                  <div className="profile stat-value">{victories}</div>
                </div>
              </>
            ) : null}
            <div className="profile button-container-create">
              <Button
                className="secondary-button"
                width="60%"
                onClick={() => navigate("/CreateLobby")}
              >
                Create Lobby
              </Button>
            </div>
            <div className="profile button-container-join">
              <Button
                className="secondary-button"
                width="60%"
                onClick={() => navigate("/JoinLobby")}
              >
                Join Lobby
              </Button>
            </div>

          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default ProfilePage;
