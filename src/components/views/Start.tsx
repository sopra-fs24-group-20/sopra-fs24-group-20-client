import React, { useState } from "react";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";

const Start = () => {
  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication circle">
          <h1 className="authentication title" >Categories</h1>
          <div className="authentication start-button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => window.location.href="/register"}
            >
              register
            </Button>
          </div>
          <div className="authentication start-button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => window.location.href="/login"}
            >
              login
            </Button>
          </div>
          <div className="authentication start-button-container">
            <Button
              className="secondary-button"
              width="60%"
              onClick={() => window.location.href="/profile"}
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
