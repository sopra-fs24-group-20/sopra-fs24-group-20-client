import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import "styles/views/Start.scss";
import BaseContainer from "components/ui/BaseContainer";
import {useNavigate} from "react-router-dom";

const Start = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const doGuest = async () => {
    try {
      const response = await api.post("/players/login");
      const user = response.data;

      localStorage.setItem("username", user.username);
      navigate(`/user/${user.username}`);
    } catch (error) {
      setError ("something went wrong while creating a guest profile");
      console.log(handleError(error))
      navigate("/start");
    }
  };

  return (
    <BaseContainer>
      <div className="start container">
        <div className="start circle">
          <h1 className="start title" >Categories</h1>
          {error && <div className="authentication error-message">{error}</div>}
          <div className="start button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => window.location.href="/register"}
            >
              register
            </Button>
          </div>
          <div className="start button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => window.location.href="/login"}
            >
              login
            </Button>
          </div>
          <div className="start button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => doGuest()}
            >
              play as guest
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Start;
