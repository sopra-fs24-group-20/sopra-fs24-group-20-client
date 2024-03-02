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
  const { id: id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const loggedInUserId = localStorage.getItem("id");
  const [editUsernameMode, setEditUsernameMode] = useState<boolean>(false);
  const [editBirthdateMode, setEditBirthdateMode] = useState<boolean>(false);
  const [editedUsername, setEditedUsername] = useState<string>("");
  const [editedBirthdate, setEditedBirthdate] = useState<string>("");

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

  const editAllowed = loggedInUserId === id;

  const handleEditUsername = () => {
    setEditUsernameMode(true);
    setEditedUsername(user.username);
  };

  const handleEditBirthdate = () => {
    setEditBirthdateMode(true);
    setEditedBirthdate(user.birthdate);
  };

  const handleSaveUsername = async () => {
    try {
      console.log(editedUsername)
      const response =  await api.put(`/users/${id}/username`, { username: editedUsername } );
      // Refresh user data after successful update
      setUser(response.data);
      setEditUsernameMode(false); // Disable edit mode
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to save username changes. Please try again.");
    }
  };

  const handleSaveBirthdate = async () => {
    try {
      const response = await api.put(`/users/${id}/birthdate`, editedBirthdate );
      // Refresh user data after successful update
      setUser(response.data);
      setEditBirthdateMode(false); // Disable edit mode
    } catch (error) {
      console.error("Error updating birthdate:", error);
      alert("Failed to save birthdate changes. Please try again.");
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUsername(event.target.value);
  };

  const handleBirthdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBirthdate(event.target.value);
  };

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
            <p><strong>Username:</strong>
              {editUsernameMode ? (
                <>
                  <input type="text" value={editedUsername} onChange={handleUsernameChange} />
                  <Button onClick={handleSaveUsername}>Save</Button>
                </>
              ) : (
                <>
                  {user.username}
                  {editAllowed && (
                    <Button onClick={handleEditUsername}>Edit</Button>
                  )}
                </>
              )}
            </p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Creation Date:</strong> {user.creationDate}</p>
            <p><strong>Birthdate:</strong>
              {editBirthdateMode ? (
                <>
                  <input type="date" value={editedBirthdate} onChange={handleBirthdateChange} />
                  <Button onClick={handleSaveBirthdate}>Save</Button>
                </>
              ) : (
                <>
                  {user.birthdate}
                  {editAllowed && (
                    <Button onClick={handleEditBirthdate}>Edit</Button>
                  )}
                </>
              )}
            </p>
          </div>
          <Button onClick={goback}>
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
