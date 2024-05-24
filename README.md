<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/categories_logo.png" /><br/>
</p>

## Introduction 
We all used to play Stadt-Land-Fluss at school, with friends or family. That's where our enthusiasm for this game comes from.
We put a lot of effort into our project to give this classic game its own twist and to develop an aesthetic but simple UI.

Categories is a game where you can play with several people in a lobby. In our version, you also have the option of changing various setting variables such as round duration or the categories themselves.

As soon as everyone is ready, the game and the timer start. You have to insert matching words into the categories as quickly as possible. You are given a random letter and the position in which it must appear in a word.
If someone finishes before the timer runs out, you can press stop, which would end the round for all players.
Afterwards you can see the answers of your opponents and rate them.

You can compete with your friends by scoring lots of points and leveling up.

## Technologies
- [Node.js](https://nodejs.org/en/docs) - JavaScript runtime environment
- [React](https://react.dev/learn) - JavaScript library for building user interfaces
- [Google Cloud](https://cloud.google.com/appengine/docs/flexible) - Deployment
- [RESTful](https://restfulapi.net/) - Web services for user control
- [Websocket](https://spring.io/guides/gs/messaging-stomp-websocket/) -  Real-time bidirectional communication between client and server
- [MySQL](https://cloud.google.com/sql/docs/mysql) - Cloud SQL for MySQL used for the database
- [Wikipedia API](https://de.wikipedia.org/wiki/Wikipedia:Technik/Datenbank/API#Dokumentation_der_Funktionalit%C3%A4t) - Allows us to request information about projects and pages to check the existence of an answer

## High-level components
### Profile Page
The [Profile Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/ProfilePage.tsx) displays information about the logged in player such as username, randomly assigned avatar and statistics from previous games. If the player is logged in as a guest, they will not have any statistics. Additionally, they can log out or create a new lobby or join one to enjoy the game with your friends. If the player doesn't know the game Categories before, they can read the rules by clicking on the info icon.
### Lobby Page
The [Lobby Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/LobbyPage.tsx) makes it possible for the player to see all other players in the lobby, leave the lobby, view or edit the settings (only possible for the lobby host) and prepare for the game by pressing ready. Through the websockets the player can see immediately when someone joins or exits and how many players are ready.
### Game Page
In the [Game Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/Game.tsx) the player gets the randomly assigned letter, the timer starts counting down and the players can enter their answers. When someone presses stop, the game is stopped for everyone, supported by websockets, and the answers are sent to the backend to be checked with the api.
### Evaluation Page
On the [Evaluation Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/EvaluationScreen.tsx) the player can see the answers of the other players and rate them, because the API only checks the spelling and not the meaning. The player sees one category per page, to comment on the next one they have to click next. If they are at the last category they wait until all players are finished, this is again handled by websockets. Once everyone has finished, the adjustments are sent to the backend and the players are redirected to either the intermediate leaderboard or the final leaderboard, if it was the last round.
### Leaderboard
The [Intermediate Leaderboard](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/Leader.tsx) displays the total scores of all players after each round, including those who have exited the lobby. If a player has participated in more than two rounds, the leaderboard also shows how much their points increased from the previous round. To start the next round, a "ready" button is available, managed through websockets, which also indicates the number of players who are ready. The [Final Leaderboard](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/FinalLeader.tsx) shows the final ranking and awards media to the top 3 and takes the player back to the lobby.

## Launch & Deployment
### Prerequisites and Installation
#### Step 1
For your local development environment you need the **v20.11.0** version of Node.js. You can download it [here](https://nodejs.org/download/release/v20.11.0/) or below.

- MacOS: [node-v20.11.0.pkg](https://nodejs.org/download/release/v20.11.0/node-v20.11.0.pkg)
- Windows 32-bit: [node-v20.11.0-x86.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x86.msi)
- Windows 64-bit: [node-v20.11.0-x64.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x64.msi)
- Linux: [node-v20.11.0.tar.xz](https://nodejs.org/dist/v20.11.0/node-v20.11.0.tar.xz)

#### Step 2

Run this command to install all other dependencies, including React:

```npm install```

#### Step 3

You can start the app with:

```npm run dev```

#### Step 4

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.
In order for these requests to work, you need to install and start the server as well.

### Testing
You can run the tests with `npm run test`\
This launches the test runner in an interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance:\
The build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Illustrations
<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/start.png" /><br/>
</p>

A player starts here, where they have various options for accessing the website.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/profile.png" /><br/>
</p>

After logging in, the player gets to this page where they can continue by creating or joining a lobby.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/lobby.png" /><br/>
</p> 

In the lobby the players can go view the settings or press ready. When everyone is ready, the game automatically begins.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/game.png" /><br/>
</p> 

This page is there the player actually plays the game. After the timer runs out or someone presses stop the players gets automatically navigated to the next page.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/eval.png" /><br/>
</p> 

Here the player can view and evaluate the answers of the other players. To continue the players need to press next. If all the players are finished evaluating, everyone get redirected to the intermediate leaderboard or the final leaderboard if the previous round was the last one.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/interLeader.png" /><br/>
</p> 

This page is where the players can view the current ranking and points of the previous rounds. This is also where they can get ready for the next round.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/finalLeader.png" /><br/>
</p> 

When all rounds are played and evaluated, the players get redirected to the final leaderboard instead of the intermediate leaderboard. They can return to the lobby as soon as they are finished viewing the final ranking.

## Roadmap
- Ability to add other players as friends
- Explore other ways to join a lobby, such as through QR codes.
- Global Top-Player Ranking

## Authors and acknowledgment.
- [Giuliano Bernasconi](https://github.com/GiulianoBernasconi)
- [Joshua Stebler](https://github.com/Joshuastebler)
- [Joshua Weder](https://github.com/joswed)
- [Leonora Horvatic](https://github.com/LeoHorv)
- [Mirjam Alexandra Weibel](https://github.com/mirjamweibel)

We would like to thank our mentor [Fengjiao Ji](https://github.com/feji08) for supporting us throughout the project.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details