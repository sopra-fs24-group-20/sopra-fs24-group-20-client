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

  const logout = async (username: string) => {
    if (username === null){
      console.log("no id saved logout")
      navigate("/start");
    }
    try {
      const response = await api.get(`/players/${localStorage.getItem("username")}`);
      console.log("id saved and exists logout");
      await api.put(`/logout/${id}`);
      localStorage.removeItem("username");
      // localStorage.removeItem("id");
      navigate("/start");
    } catch (error) {
      if (error.response.status === 404){
        console.log("id saved but doesn't exist logout");
        localStorage.removeItem("username");
        // localStorage.removeItem("id");
        navigate("/start");
      }
      console.error(
        `An error occurred while checking user authorization: \n${handleError(error)}`
      );
    }
  };


  const handleClick = () => {
    logout(localStorage.getItem("username"))
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
                 <a href="#" onClick={handleClick}>logout</a>
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
