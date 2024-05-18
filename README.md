<p>
  <img alt="" src="https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/tree/main/src/images/categories_logo.png" /><br/>
</p>

## Introduction 
We all used to play Stadt-Land-Fluss at school, with friends or family. That's where our enthusiasm for this game comes from.

We put a lot of effort into our project to give this classic game its own twist and to develop an aesthetic but simple UI.

Categories is a game where you can play with several people in a lobby. In our version, you also have the option of changing various setting variables.

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
The [Profile Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/ProfilePage.tsx)...
### Lobby Page
The [Lobby Page](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/LobbyPage.tsx)...
### Game Page
The [Game Page]()
### Evaluation Page
The [Evaluation Page]()
### Leaderboard
The [Intermediate Leaderboard](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/Leader.tsx)...[Final Leaderboard](https://github.com/sopra-fs24-group-20/sopra-fs24-group-20-client/blob/main/src/components/views/FinalLeader.tsx)...
## Launch & Deployment
Write down the steps a new developer joining your team would
have to take to get started with your application. What commands are required to build and
run your project locally? How can they run the tests? Do you have external dependencies
or a database that needs to be running? How can they do releases?

### new installs:

npm install react-confetti

npm install net

npm install stompjs

npm install sockjs-client

npm install --save-dev svg-loader

npm install crypto-js

## Illustrations
In your client repository, briefly describe and illustrate the main user flow(s)
of your interface. How does it work (without going into too much detail)? Feel free to
include a few screenshots of your application.
## Roadmap
The top 2-3 features that new developers who want to contribute to your project could add.
## Authors and acknowledgment.
## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details


# old
## Getting started
Read and go through these Tutorials. It will make your life easier:)

- Read the React [Docs](https://react.dev/learn)
- Do this React [Getting Started](https://react.dev/learn/tutorial-tic-tac-toe) Tutorial (it doesn't assume any existing React knowledge)
- Get an Understanding of [CSS](https://www.w3schools.com/Css/), [SCSS](https://sass-lang.com/documentation/syntax), and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Next, there are two other technologies that you should look at:

* [react-router-dom](https://reactrouter.com/en/main/start/concepts) offers declarative routing for React. It is a collection of navigational components that fit nicely with the application. 
* [react-hooks](https://blog.logrocket.com/using-hooks-react-router/) let you access the router's state and perform navigation from inside your components.

## Prerequisites and Installation
For your local development environment, you will need Node.js.\
We urge you to install the exact version **v20.11.0** which comes with the npm package manager. You can download it [here](https://nodejs.org/download/release/v20.11.0/).\
If you are confused about which download to choose, feel free to use these direct links:

- **MacOS:** [node-v20.11.0.pkg](https://nodejs.org/download/release/v20.11.0/node-v20.11.0.pkg)
- **Windows 32-bit:** [node-v20.11.0-x86.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x86.msi)
- **Windows 64-bit:** [node-v20.11.0-x64.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x64.msi)
- **Linux:** [node-v20.11.0.tar.xz](https://nodejs.org/dist/v20.11.0/node-v20.11.0.tar.xz) (use this [installation guide](https://medium.com/@tgmarinho/how-to-install-node-js-via-binary-archive-on-linux-ab9bbe1dd0c2) if you are new to Linux)

If you happen to have a package manager the following commands can be used:

- **Homebrew:** `brew install node@20.11.0`
- **Chocolatey:** `choco install nodejs-lts --version=20.11.0`

After the installation, update the npm package manager to **10.4.0** by running ```npm install -g npm@10.4.0```\
You can ensure the correct version of node and npm by running ```node -v``` and ```npm --version```, which should give you **v20.11.0** and **10.4.0** respectively.\
Before you start your application for the first time, run this command to install all other dependencies, including React:

```npm install```

Next, you can start the app with:

```npm run dev```

Now you can open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
Notice that the page will reload if you make any edits. You will also see any lint errors in the console (use a Chrome-based browser).\
The client will send HTTP requests to the server which can be found [here](https://github.com/HASEL-UZH/sopra-fs24-template-server).\
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