import React from "react";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "components/ui/Button";
// @ts-ignore
import svgImageSad from "images/sad.svg";
import "styles/views/Backup.scss";
import { useNavigate } from "react-router-dom";


const BackupScreen = () => {
  const navigate = useNavigate();
  
  const username = localStorage.getItem("username");
  const handleClick = () => {
    if (username) {
      navigate(`/user/${username}`)
    }
    else {
      navigate("/start")
    }
  };

  return (
    <BaseContainer>
      <div className="backup container">
        <div className="backup form">
          <div className="svg-container">
            <img src={svgImageSad} alt="Sad Face" className="svg-image" />
          </div>
          <div className="backup text">404 Page Not Found</div>
          <div> This site does not seem to exist</div>
        </div>
        <div className="backup button-container">
          <Button
            width="100%"
            onClick={() => handleClick()}
          >
            Start / Profile Screen
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default BackupScreen;