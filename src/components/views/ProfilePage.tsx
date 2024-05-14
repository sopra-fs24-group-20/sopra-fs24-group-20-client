import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import { User } from "types";
import "styles/views/Authentication.scss";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";
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
  const CryptoJS = require("crypto-js");
  const all_pictures = [svgImage1, svgImage2, svgImage3, svgImage4,svgImage5,svgImage6,svgImage7,svgImage8,svgImage9,svgImage10,svgImage11,svgImage12,svgImage13,svgImage14,svgImage15,svgImage16,svgImage17,svgImage18,svgImage19,svgImage20,svgImage21,svgImage22,svgImage23,svgImage24,svgImage25];

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

  function hashUsername(username) {
    const hashedUsername = CryptoJS.SHA256(username).toString(CryptoJS.enc.Hex);
    const hashedInt = parseInt(hashedUsername, 16);
    const containerIndex = hashedInt % 25;

    return all_pictures[containerIndex];
  }

  return (
    <BaseContainer>
      <div className="profile container">
        <div className="profile form">
          <div className="profile left-axis">
            <h1 className="profile top-text">{username && username.replace(/^Guest:/, "")}</h1>
            <div className="profile avatar-container">
              <object type="image/svg+xml" data={hashUsername(localStorage.getItem("username"))}></object>
            </div>
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
