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
            <div>On this page you can:</div>
            <div><strong>1.</strong> <span style={{ fontStyle: "italic" }}>Create a Lobby</span>. You create a new lobby and you become the lobby host. Share the lobby login credentials with your friends!</div>
            <div><strong>2.</strong> <span style={{ fontStyle: "italic" }}>Join an existing Lobby</span> You join an existing lobby as a regular player. Ask the lobby host for the lobby login credentials.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Lobby Screen:</strong></div>
            <div>Once you have created or joined a lobby, you can click on <span style={{ fontStyle: "italic" }}>Ready</span> to signal you are ready for the game.</div>
            <div>Once all players currently in the lobby have pressed ready the game starts.</div>
            <div>Only the lobby host can see and modify the settings. To apply the changes made, click on <span style={{ fontStyle: "italic" }}>save</span></div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Settings</strong></div>
            <div>The following options can be changed by the host:</div>
            <div><strong>1. Categories:</strong> Modify the preset categories. You can set a minimum of 1 and maximum of 8 categories per game.</div>
            <div><strong>2. Time (in seconds):</strong> Set the round duration. You can set a minimum of 10 seconds and a maximum of 3 minutes per round.</div>
            <div><strong>3. Rounds:</strong> Edit the number of rounds per game. You can set a minimum of 1 round and a maximum of 10 rounds per game.</div>
            <div><strong>4. Game Mode:</strong> Change the game mode. The default mode is normal, where you get assigned a random letter at the first position of the word per round. </div>
            <div>You can set a hard mode where you get assigned a random letter at either the first, second, third, or last position of the word per round.</div>
            

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Game Screen:</strong></div>
            <div>Once a round has started, you should think of words with the given letter at the given position that fit in each category.</div>
            <div>As soon as you are done filling in all answers, you can press <span style={{ fontStyle: "italic" }}>Stop</span> to immediately stop the round for everyone in the lobby.</div>
            <div>Similarly, if another player is done and presses <span style={{ fontStyle: "italic" }}>Stop</span> the round immediately ends for you and all other players.</div>
            <div>If no one presses <span style={{ fontStyle: "italic" }}>Stop</span> the round ends automatically after the timer runs out.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Evaluation Screen:</strong></div>
            <div>After the game stops, you get to the evaluation screen where all answers of the current round for all the players are displayed, sorted by category.</div>
            <div>To  green tick next to the answer means the word exists on Wikipedia (valid), a red cross means the word does not exist on Wikipedia (invalid).</div>
            <div>For all answers but your own, you can press one of the following two buttons:</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div><strong>1. Veto:</strong> If you disagree with the validity of an answer, press <span style={{ fontStyle: "italic" }}>Veto</span>.</div>
            <div>If the majority of the players press veto for a certain answer, the answer changes its validity status.</div>
            <div><strong>2. Bonus:</strong> You can award creativity bonus of three points for particularly creative answers,  regardless of their validity status .</div>
            <div>Generally, a valid answer that is unique for the category is rewarded with 10 points, a valid answer not unique for the category is</div>
            <div>rewarded with 5 points, an invalid answer gets 0 points, and if you are the only player that has submitted a valid answer for a category,</div>
            <div>you get 15 points. Bonus points are added regardless of vetos and validity status.</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div>You can undo your votes by clicking the corresponding button again, and you can navigate between the categories going back and forth using the navigation buttons.</div>
            <div>Once you are happy with your votes, you can press <span style={{ fontStyle: "italic" }}>Finish</span> on the last category&apos;s page to send your votes.</div>
            <div>As soon as all players have submitted their votes, you get transferred to the intermediate</div>
            <div>leaderboard, where you can see the current ranking and can get ready for the next round.</div>
            <div>If this was your last round in the current game, you get lead to the final leaderboard to see the final ranking of the current game and you can return to the lobby.</div>

            <div style={{ marginBottom: "50px" }}></div>

          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default PopupWindow;