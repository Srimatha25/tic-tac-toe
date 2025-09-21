🎮 Multiplayer Tic Tac Toe
A real-time multiplayer Tic Tac Toe game built using Node.js, Express, and Socket.IO. Challenge a friend on the same local network or open two browser tabs to play against yourself.

✨ Features
Real-time Gameplay: Instantaneous moves and game state updates for both players.

Multiplayer Mode: Play with a friend on the same local network using a shared URL.

Matchmaking: Click "Find Match" to automatically pair with an available opponent.

Win/Loss Detection: The game correctly identifies when a player has won or if the game is a draw.

Simple UI: A clean, intuitive interface that focuses on the core gameplay.

🛠️ Technologies Used
HTML: Provides the fundamental structure of the game interface.

CSS: Handles the styling and layout of the game board.

Node.js: The server-side environment for running the game logic.

Express: A web framework for Node.js used to serve the game's static files.

Socket.IO: A library that enables real-time, bidirectional communication between the web client and the server. This is the core technology for the multiplayer functionality.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
You need to have Node.js and npm (Node Package Manager) installed on your system. You can download them from nodejs.org.

Installation
Clone the repository:

Bash

git clone https://github.com/Srimatha25/tic-tac-toe.git
Navigate into the project directory:

Bash

cd tic-tac-toe
Install the required Node.js packages:

Bash

npm install
Usage
Start the server from your terminal:

Bash

node server.js
Open your web browser and go to http://localhost:3000.

To play against an opponent, you can either:

Open the same URL on another device on your local network.

Open a new tab in your browser and go to the same URL.

Click the "Find Match" button to start playing.

📂 Project Structure
index.html: The main page for the game's user interface.

style.css: Contains all the CSS rules for styling the game.

server.js: The backend server using Node.js, Express, and Socket.IO to handle game logic and real-time communication.
