import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Authentication.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one and the same file.
 */
const FormField = (props) => {
  return (
    <div className="authentication field">
      <label className="authentication label">{props.label}</label>
      <input
        className="authentication input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);
  const [error, setError] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);
      const user = response.data;

      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);
      navigate("/game");}

    catch (error) {
      setError ("Invalid username or password");
    }
  };

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
          />
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
