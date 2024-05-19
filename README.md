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
- [Wiktionary API](https://en.wiktionary.org/w/api.php) - Provides dictionary data

## High-level components 
Identify your project’s 3-5 main components. What is their role?
How are they correlated? Reference the main class, file, or function in the README text
with a link.
### Profile Page
The [Profile Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/ProfilePage.tsx) displays information about the logged in user such as username, randomly assigned avatar and statistics from previous games. If you are logged in as a guest, you will not have any statistics. Additionally, you can log out or create a new lobby or join one to enjoy the game with your friends. If you don't know the game Categories before, you can read the rules by clicking on the info icon.
### Lobby Page
The [Lobby Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/LobbyPage.tsx) makes it possible for the user to see all other players in the lobby, leave the lobby, access the settings and prepare for the game by pressing ready. Through the websockets you can see immediately when someone joins or exits and how many players are ready.
### Game Page
In the [Game Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/Game.tsx) the player gets the randomly assigned letter, the timer starts counting down and the players can enter their answers. When you press stop, the game is stopped for everyone, supported by websockets, and the answers are sent to the backend to be checked with the api.
### Evaluation Page
The [Evaluation Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/EvaluationScreen.tsx) ...
### Leaderboard
The [Intermediate Leaderboard](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/Leader.tsx) ...

## Launch & Deployment
### Prerequisites and Installation
For your local development environment you need the **v20.11.0** version of Node.js. You can download it [here](https://nodejs.org/download/release/v20.11.0/) or below.

- **MacOS:** [node-v20.11.0.pkg](https://nodejs.org/download/release/v20.11.0/node-v20.11.0.pkg)
- **Windows 32-bit:** [node-v20.11.0-x86.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x86.msi)
- **Windows 64-bit:** [node-v20.11.0-x64.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x64.msi)
- **Linux:** [node-v20.11.0.tar.xz](https://nodejs.org/dist/v20.11.0/node-v20.11.0.tar.xz)

Next, run this command to install all other dependencies, including React:

```npm install```

Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.
In order for these requests to work, you need to install and start the server as well.

### Testing
Testing is optional, and you can run the tests with `npm run test`\
This launches the test runner in an interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into a 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### Build
Finally, `npm run build` builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance:\
The build is minified, and the filenames include hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Other packages we used
- npm install react-confetti
- npm install net
- npm install stompjs
- npm install sockjs-client
- npm install --save-dev svg-loader
- npm install crypto-js

## Illustrations
<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/start.jpg" /><br/>
</p>
A player starts here, where they have various options for accessing the website.
<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/profile.jpg" /><br/>
</p>
After logging in, the player gets to this page where they can continue by creating or joining a lobby.

-- lobby page --

In the lobby the players can go view the settings or press ready. When everyone is ready, the game automatically begins.

<p>
    <img alt="" src="https://raw.githubusercontent.com/sopra-fs24-group-20/sopra-fs24-group-20-client/main/src/images/game.jpg" /><br/>
</p>
This page is there the player actually plays the game. After the timer runs out or someone presses stop the players gets automatically navigated to the next page.

-- evaluation page --
-- intermediate leaderboard page --
-- final leaderboard page -- 


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