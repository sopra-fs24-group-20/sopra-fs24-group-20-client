import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

const FormField = (props) => {
  return (
    <div className="authentication field">
      <label className="authentication label">{props.label}</label>
      <input
        className="authentication input"
        placeholder="enter here.."
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      setLoading(true);
      const registerResponse = await api.post("/players", requestBody);
      const userData = registerResponse.data;
      // Get the returned user and update a new object.
      const user = new User(userData);
      await api.post("/players/login", { username, password });


      // Store the username into the local storage.
      localStorage.setItem("username", user.username);
      // localStorage.setItem("id", user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate(`/user/${user.username}`);
    } catch (error) {
      setError ("username already taken");
      console.log(handleError(error))
      navigate("/register");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.history.back(); // Navigate back using browser's history object
  };

  if (loading) {
    return (
      <BaseContainer>
        <div className="authentication container">
          <div className="authentication form">
            <CategoriesLoadingScreen />
          </div>
        </div>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer>
      <div className="authentication container">
        <div className="authentication form">
          <div className="authentication back-arrow">
            <Button
              className="secondary-button"
              width="fit-content"
              onClick={() => goBack()}
            >
              Back
            </Button>
          </div>
          <h1 className="authentication centered-text" >Register</h1>
          {error && <div className="authentication error-message">{error}</div>}
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(pw) => setPassword(pw)}
            type={showPassword ? "text" : "password"}
          />
          <div className="authentication checkbox-container">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="authentication checkbox-label">Show Password</label>
          </div>
        </div>
        <div className="authentication button-container">
          <Button
            disabled={!username || !password}
            width="100%"
            onClick={() => doRegister()}
          >
            Register
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Register;
