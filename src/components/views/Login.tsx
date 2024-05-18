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
      setError ("Invalid username or password");
      console.log(handleError(error))
      navigate("/login");
    } finally {
      setLoading(false);
    }
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
        <div>
          <a className="authentication link" href="/start">back</a>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
