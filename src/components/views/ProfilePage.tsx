import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import { User } from "types";

const ProfilePage = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = async () => {
    localStorage.clear();
    navigate("/start");
  };


  const handleClick = () => {
    logout()
  };


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/players/${localStorage.getItem("username")}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [localStorage.getItem("username")]);

  return (
    <BaseContainer>
      <div className="profile container">
        <div className="profile form">
          <div className="profile left-axis">
            <h1 className="profile top-text">{user?.username}</h1>
            <div>
              <p>
                <a className="profile link" href="#" onClick={handleClick}>logout</a>
              </p>
            </div>
          </div>

          <div className="profile right-axis">
            <div className="profile button-container">
              <Button
                className="secondary-button"
                width="60%"
                onClick={() => navigate("/CreateLobby")}
              >
                Create Lobby
              </Button>
            </div>
            <div className="profile button-container">
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
