import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Settings.scss";
import "styles/views/Authentication.scss";
import PropTypes from "prop-types";
import CategoriesLoadingScreen from "components/ui/LoadingScreen";

const FormField = (props) => {
  return (
    <div className="settings field">
      <input
        className="settings input"
        placeholder={props.placeholder}
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.showDelete && (
        <div className="settings delete" onClick={props.onDelete}>
          ❌
        </div>
      )}
    </div>
  );
};

FormField.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  showDelete: PropTypes.bool,
};

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ categories: [], gameMode: 1 });
  const localLobbyId = localStorage.getItem("lobbyId");
  const localUsername = localStorage.getItem("username");
  const localLobbyName = localStorage.getItem("lobbyName");
  const [owner, setOwner] = useState(true);
  const [disableSave, setDisableSave] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const [saveConfirmation, setSaveConfirmation] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(settings).length === 0) {
      fetchData();
    }
    validateCategories();
  }, [settings]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lobby/settings/${localLobbyId}`);
      setSettings(response.data);
      console.log(response.data);
      if (localUsername === response.data.lobbyOwner.username) {
        setOwner(false);
      }
    } catch (error) {
      alert(`Something went wrong during fetching the settings: \n${handleError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const validateCategories = () => {
    const isEmpty = settings.categories.some((category) => category.trim() === "");
    setDisableSave(isEmpty);
  };

  const saveChanges = async () => {
    try {
      await api.put(`/lobby/settings/${localLobbyId}`, JSON.stringify(settings));
      setSaveConfirmation("Settings saved successfully!");
      setError(null);
    } catch (error) {
      console.log(handleError(error));
      setError("Are your excluded letters in the right format e.g. X,Y,Z ?");
      setSaveConfirmation(null);
    }
  };

  const addCategory = () => {
    const lastCategory = settings.categories[settings.categories.length - 1];
    if (lastCategory && lastCategory.trim() !== "") {
      if (settings.categories.length < 8) {
        setSettings({ ...settings, categories: [...settings.categories, ""] });
      }
    } else {
      alert("Please fill in the previous category field before adding another.");
    }
  };

  const handleCategoryChange = (index, value) => {
    const updatedCategories = [...settings.categories];
    updatedCategories[index] = value;
    setSettings({ ...settings, categories: updatedCategories });
  };

  const deleteCategory = (index) => {
    const updatedCategories = [...settings.categories];
    updatedCategories.splice(index, 1);
    setSettings({ ...settings, categories: updatedCategories });
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
      <div className="settings container">
        <div className="settings form">
          <div>
            <h2 className="settings centered-text">Settings</h2>
            {error && <div className="settings error-message">{error}</div>}
            {saveConfirmation && <div className="settings success-message">{saveConfirmation}</div>} {/* Display success message */}
            <div className="settings column">
              Categories
              {settings.categories &&
                settings.categories.map((category, index) => (
                  <FormField
                    key={index}
                    placeholder="enter here..."
                    value={category}
                    onChange={(value) => handleCategoryChange(index, value)}
                    onDelete={() => deleteCategory(index)}
                    type="text"
                    showDelete={settings.categories.length > 1}
                  />
                ))}
              {settings.categories.length < 8 && (
                <Button onClick={addCategory}>Add Category</Button>
              )}
            </div>
            <div className="settings column">
              Time (sec)
              <FormField
                value={settings.roundDuration ? settings.roundDuration.toString() : ""}
                onChange={(time) =>
                  setSettings({
                    ...settings,
                    roundDuration: parseInt(time, 10) || 0,
                  })
                }
                type="number"
              />
              Rounds
              <FormField
                value={settings.rounds ? settings.rounds.toString() : ""}
                onChange={(rounds) =>
                  setSettings({
                    ...settings,
                    rounds: parseInt(rounds, 10) || 0,
                  })
                }
                type="number"
              />
              Exclude Letter
              <FormField
                value={settings.excludedChars ? settings.excludedChars.join(",").toUpperCase() : ""}                placeholder="e.g. X,Y,Z"
                onChange={(excludedChars) =>
                  setSettings({
                    ...settings,
                    excludedChars: excludedChars.split(",").map(char => char.trim()),
                  })
                }
                type="text"
              />
            </div>
            <div className="settings column">
              Game Mode
              <select
                className="settings dropdown"
                value={settings.gameMode}
                onChange={(e) => setSettings({ ...settings, gameMode: parseInt(e.target.value, 10) })}
              >
                <option value={0}>easy</option>
                <option value={1}>normal</option>
              </select>
            </div>
          </div>
          <div className="settings centered-text">
            <Button
              className="secondary-button"
              width="60%"
              onClick={saveChanges}
              disabled={owner || disableSave}
            >
              {owner ? "Only lobby owner can edit" : "Save"}
            </Button>
          </div>
        </div>
        <div className="settings button-container">
          <Button width="100%" onClick={() => navigate(`/lobby/${localLobbyName}`)}>
            Back to Lobby
          </Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Settings;
