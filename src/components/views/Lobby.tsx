import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Lobby.scss";
import { Lobby } from "types";

const LobbyPage = () => {
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [lobby, setLobby] = useState<Lobby>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const exit = async () => {
    const local_id = localStorage.getItem("id");
    try {
      const response = await api.get(`/users/${local_id}`);
      await api.put(`/logout/${local_id}`);
      navigate(`/user/${local_id}`);
    } catch (error) {
      alert(
        `Something went wrong during exiting the lobby: \n${handleError(error)}`
      );
      navigate(`/user/${local_id}`);
    }
  };

  const ready = async () => {
    try {
    } catch (error) {
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/lobby/${lobby.lobbyName}`); ///// BRUDER WAS
        setLobby(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

  return (
    <BaseContainer>
      <div className="lobby container">
        <div className="lobby form">
          <div className="lobby centered-text">
            <h1 className="lobby title">test</h1>

            <ul className="lobby ul">
              <li className="lobby li"> Player 1</li>
              <li className="lobby li"> Player 2</li>
              <li className="lobby li"> Player 3</li>
            </ul>

            <div className="lobby ready">test</div>
            <Button
              className="secondary-button"
              width="60%"
              onClick={ready}
            >
              ready
            </Button>

            <div>
              <a className="lobby link" href="#" onClick={exit}>exit</a>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default LobbyPage;
