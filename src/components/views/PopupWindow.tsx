import React from "react";
import BaseContainer from "../ui/BaseContainer";
import "styles/views/Popup.scss";


const PopupWindow = () => {
  return (
    <BaseContainer>
      <div className="popup container">
        <div className="popup form">
          <div className="popup text">
            <div><strong>Getting Started</strong></div>
            <div>Your options are:</div>
            <div><strong>1.</strong> Clicking on <span style={{ fontStyle: "italic" }}>Create Lobby</span> lets you create a new lobby and become the lobby host. Share the lobby login credentials with your friends!</div>
            <div><strong>2.</strong> Clicking on <span style={{ fontStyle: "italic" }}>Join Lobby</span> lets you join an existing lobby as a regular player. Ask the lobby host for the lobby login credentials.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Lobby Screen:</strong></div>
            <div>Once you have created or joined a lobby, you can click on <span style={{ fontStyle: "italic" }}>Ready</span> to ready up for the game.</div>
            <div>Only once all players currently in the lobby have pressed ready does the game start.</div>
            <div>You can click on the gear icon to view the game settings, but only the lobby host can change them.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Settings</strong></div>
            <div>Currently, the following options can be changed only by the host:</div>
            <div><strong>1. Categories:</strong> Modify the preset categories. You can set a minimum of 1 and maximum of 8 categories per game.</div>
            <div><strong>2. Time (in seconds):</strong> Set the round duration. You can set a minimum of 10 seconds and a maximum of 3 minutes per round.</div>
            <div><strong>3. Rounds:</strong> Edit the number of rounds in a game. You can set a minimum of 1 round and a maximum of 10 rounds per game.</div>
            <div><strong>4. Game Mode:</strong> Change the game mode. The default mode is normal, where you get a random letter and a random position. In the game</div>
            <div> the game you have to fill the blanks with words fitting the categories. In your answers you have to include the given letter at the given word position.</div>
            <div>You can set an easy mode to always get the given letter at the first position instead.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Game Screen:</strong></div>
            <div>Once a round has started, you should think of words with the given letter at the given position that fit the categories.</div>
            <div>As soon as you are done filling in all answers, you can press <span style={{ fontStyle: "italic" }}>Stop</span> to stop the game for everyone in the lobby.</div>
            <div>When someone else presses <span style={{ fontStyle: "italic" }}>Stop</span> or the timer runs out, the game stops, and you get to the evaluation screen.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Evaluation Screen:</strong></div>
            <div>Here, all the answers of all the players are displayed, sorted by category.</div>
            <div>The validity of all answers is shown either by a green tick (valid) or a red cross (invalid).</div>
            <div>For all answers but your own, you can press one of the following two buttons:</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div><strong>1. Veto:</strong> If you disagree with the validity of an answer, press <span style={{ fontStyle: "italic" }}>Veto</span>.</div>
            <div>If the majority of the players give a certain answer a veto, the answer changes its validity status.</div>
            <div><strong>2. Bonus:</strong> You can award answers a creativity bonus of three points regardless of validity status.</div>
            <div>Generally, a valid answer that is unique for the category is rewarded with 10 points, a valid answer not unique for the category is</div>
            <div>rewarded with 5 points, an invalid answer gets 0 points, and if you are the only player that has submitted a valid answer for a category,</div>
            <div>you get 15 points. Bonus points are added regardless.</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div>You can undo your votes by clicking the corresponding button again, and you can navigate within th evaluation screen going back and forth.</div>
            <div>Once you are happy with your votes, you can press on <span style={{ fontStyle: "italic" }}>Next</span> to evaluate the answers of the next category. Once you have evaluated all</div>
            <div>categories, you have to wait until all other players have submitted their evaluations. Then you get transferred to the intermediate</div>
            <div>leaderboard, where you can see the current ranking. If this is your last round, you get to the final leaderboard to see the final ranking.</div>

            <div style={{ marginBottom: "50px" }}></div>

          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default PopupWindow;