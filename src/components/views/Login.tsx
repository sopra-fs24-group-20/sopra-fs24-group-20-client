import React, { useState,useEffect } from "react";
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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      setLoading(true);
      const response = await api.post("/players/login", requestBody);
      const user = response.data;

      localStorage.setItem("username", user.username);
      // localStorage.setItem("id", user.id);
      navigate(`/user/${user.username}`);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code 
        if (error.response.status === 401) {
          // Handle UNAUTHORIZED error
          setError("Username or password does not match");
        } else if (error.response.status === 403) {
          // Handle FORBIDDEN error
          setError("Cannot log in, this user is already logged in");
        } else {
          // Handle other errors
          setError("An error occurred while logging in. Please try again later.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setError("No response received from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error", error.message);
        setError("An unexpected error occurred. Please try again later.");
      }
      navigate("/login");
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
          <h1 className="authentication centered-text" >Login</h1>
          {error && <div className="authentication error-message">{error}</div>}
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
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
            onClick={() => doLogin()}
          >
            Login
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
  

};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
