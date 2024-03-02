import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import { User } from "types";

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [id]);

  const goback = (): void => {
    navigate("/game");
  };

  return (
    <BaseContainer className="game container">
      {loading ? (
        <Spinner />
      ) : user ? (
        <>
          <h2>Profile Page</h2>
          <div>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Creation Date:</strong> {user.creationDate}</p>
            <p><strong>Birthdate:</strong> {user.birthdate }</p>
          </div>
          <Button width="100%" onClick={() => goback()}>
            Return to user overview
          </Button>
        </>
      ) : (
        <p>User not found</p>
      )}
    </BaseContainer>
  );
};

export default ProfilePage;
