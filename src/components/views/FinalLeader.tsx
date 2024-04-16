import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import { Lobby, User } from "types";

const Player = ({ user }: { user: User }) => (
  <div className="lobby container">
    <div className="leader username">
      <a href="#">{user.username}</a></div>
  </div>
);

Player.propTypes = {
  user: PropTypes.object,
};

const FinalLeader = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(null);
  const [lobby, setLobby] = useState<Lobby[]>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, []);

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <h2 className="lobby centered-text">
            Final Ranking
          </h2>
          <ul className="leader user-list">
              <li >
                he
              </li>
          </ul>
          <Button width="100%" onClick={() => navigate(`/lobby/${lobby.lobbyName}`)}>
            Back to Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default FinalLeader;
