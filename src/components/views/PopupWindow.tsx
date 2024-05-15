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
            <div>You are currently on your profile screen, where you can see your username and the stats.</div>
            <div>Your options are:</div>
            <div><strong>1.</strong> Clicking on <span style={{ fontStyle: "italic" }}>Create Lobby</span> lets you
              create a new lobby as a host.
            </div>
            <div><strong>2.</strong> Clicking on <span style={{ fontStyle: "italic" }}>Join Lobby</span> lets you join
              an existing lobby as a regular player.
            </div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Lobby Screen:</strong></div>
            <div>Once you created or joined a lobby, you can click on <span
              style={{ fontStyle: "italic" }}>Ready</span> to ready up for the game.
            </div>
            <div>Only once all players, which are in the lobby, have pressed on ready, the game will start.</div>
            <div>Note that by clicking on the gear icon on the top right, every player is able to view the</div>
            <div>game settings. Only the host, however, is able to change them.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Settings Screen:</strong></div>
            <div>Currently, the following options can be changed:</div>
            <div><strong>1. Categories:</strong> Add new categories to your game.</div>
            <div><strong>2. Time (sec):</strong> Set the round duration.</div>
            <div><strong>3. Rounds:</strong> Edit the number of rounds.</div>
            <div><strong>4. Game Mode:</strong> Change the game mode. Further information can be found on the Settings Screen.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Game Screen:</strong></div>
            <div>Once a round has started, every player is able to fill out their answers. A random letter</div>
            <div>gets chosen and is displayed in the top left corner. The remaining time is displayed in</div>
            <div>the top right corner.</div>
            <div>Once the first player presses on <span style={{ fontStyle: "italic" }}>Stop</span>, or the
              timer runs out, the round stops
            </div>
            <div>for every player and everyone get redirected to the evaluation screen.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Evaluation Screen:</strong></div>
            <div>Here, all the answers of all the players are displayed, going by category. The validity of</div>
            <div>all answers is shown my either a green hook (valid), or a red cross (invalid). Valid answers</div>
            <div>award 10 points, invalid answers award 0 points.</div>
            <div>For all answers, other than their own, players can press one of the following two buttons:</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div><strong>1. Veto:</strong> If the majority of the players gives a certain answer a veto, the answer changes</div>
            <div>its validity status.</div>
            <div><strong>2. Bonus:</strong> Players are able to award certain answers a bonus of three points.</div>

            <div style={{ marginBottom: "20px" }}></div>

            <div>Once a player feels confident in their votes, they can press on <span style={{ fontStyle: "italic" }}>next</span>,
              to evaluate
            </div>
            <div>the answers of the next category. Once all categories are evaluated, players have to wait for</div>
            <div>the other players to finish. After every player has finished their votes, they are either</div>
            <div>transferred to the Intermediate Leaderboard Screen (if they haven&apos;t played all the rounds) or
            </div>
            <div>to the Final Leaderboard Screen.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Intermediate Leaderboard Screen:</strong></div>
            <div>Displays the current rankings.</div>

            <div style={{ marginBottom: "50px" }}></div>

            <div><strong>Final Leaderboard Screen:</strong></div>
            <div>Final rankings. A button is displayed to return to the lobby.</div>

            <div style={{ marginBottom: "50px" }}></div>

          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default PopupWindow;