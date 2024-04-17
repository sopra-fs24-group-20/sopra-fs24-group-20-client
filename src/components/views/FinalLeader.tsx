import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {useNavigate} from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Leaderboard.scss";
import { Lobby, User } from "types";
import Confetti from "react-confetti";

const Player = ({ user }: { user: User }) => (
  <div className="leaderboard container">
    <div className="leaderboard username">
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
      <div className="leaderboard container">
        <div className="leaderboard form">
          <h2 className="leaderboard centered-text">Final Ranking</h2>
          <ul className="leaderboard user-list">
              <li >
                he
              </li>
          </ul>
          <Button width="100%" onClick={() => navigate(`/lobby/${lobby.lobbyName}`)}>
            Back to Lobby
          </Button>
          <Confetti
            colors={['#64f1f1','#9135a4','#ff03bf','#e8d152','#c0c0c0']}
            width={window.innerWidth}
            height={window.innerHeight}>
          </Confetti>
        </div>
      </div>
    </BaseContainer>
  );
};

export default FinalLeader;
