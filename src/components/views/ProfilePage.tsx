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
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [birthdateInput, setBirthdateInput] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${username}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, [username]);

  const goback = (): void => {
    navigate("/game");
  };

  const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdateInput(event.target.value);
  };

  const handleSaveBirthdate = async () => {
    try {
      // Update the user's birthdate
      const updatedUser = { ...user, birthdate: birthdateInput };
      await api.put(`/users/${username}`, updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user's birthdate:", error);
      alert("Something went wrong while updating user's birthdate! See the console for details.");
    }
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
            <p><strong>Birthdate:</strong>
              {user.birthdate ? (
                user.birthdate
              ) : (
                <>
                  <input type="date" value={birthdateInput} onChange={handleBirthdateChange} />
                  <Button onClick={handleSaveBirthdate}>Save</Button>
                </>
              )}
            </p>
          </div>
          <Button width="100%" onClick={() => goback()}>
            Return to User Overview
          </Button>
        </>
      ) : (
        <p>User not found</p>
      )}
    </BaseContainer>
  );
};

export default ProfilePage;
