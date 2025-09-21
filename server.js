// server.js
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Simple matchmaking queue
let waiting = null;

// Game state per room
const games = {}; // roomId -> { board: Array(9), turn: 'X'|'O', players: {socketId: symbol} }

io.on('connection', (socket) => {
    console.log('connected', socket.id);

    socket.on('joinQueue', () => {
        if (waiting === null) {
            waiting = socket;
            socket.emit('waiting'); // tell user they're waiting
        } else {
            // Create room
            const roomId = `${waiting.id}#${socket.id}`;
            const p1 = waiting;
            const p2 = socket;
            waiting = null;

            p1.join(roomId);
            p2.join(roomId);

            // initialize game
            const board = Array(9).fill(null);
            games[roomId] = {
                board,
                turn: 'X',
                players: {}
            };
            // assign symbols
            games[roomId].players[p1.id] = 'X';
            games[roomId].players[p2.id] = 'O';

            // notify clients
            io.to(roomId).emit('start', {
                roomId,
                symbol: {
                    [p1.id]: 'X', [p2.id]: 'O' },
                turn: games[roomId].turn,
            });
            console.log(`room ${roomId} started`);
        }
    });

    socket.on('playMove', ({ roomId, index }) => {
        const game = games[roomId];
        if (!game) return;
        const playerSymbol = game.players[socket.id];
        if (!playerSymbol) return;

        // validate move: index in range, cell empty, player's symbol matches turn
        if (index < 0 || index > 8) return;
        if (game.board[index] !== null) return;
        if (game.turn !== playerSymbol) return;

        game.board[index] = playerSymbol;
        // check win/draw
        const winner = checkWinner(game.board);
        if (winner) {
            io.to(roomId).emit('gameOver', { winner, board: game.board });
            // keep game state until restart or disconnect
        } else if (game.board.every((c) => c !== null)) {
            io.to(roomId).emit('gameOver', { winner: null, board: game.board }); // draw
        } else {
            // switch turn
            game.turn = game.turn === 'X' ? 'O' : 'X';
            io.to(roomId).emit('movePlayed', { board: game.board, turn: game.turn });
        }
    });

    socket.on('restart', ({ roomId }) => {
        const game = games[roomId];
        if (!game) return;
        // reset board and set X to move
        game.board = Array(9).fill(null);
        game.turn = 'X';
        io.to(roomId).emit('restarted', { board: game.board, turn: game.turn });
    });

    socket.on('disconnecting', () => {
        // if socket was waiting in queue, clear it
        if (waiting && waiting.id === socket.id) waiting = null;

        // notify rooms the socket is in
        const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        rooms.forEach((roomId) => {
            socket.to(roomId).emit('opponentLeft');
            // cleanup game
            delete games[roomId];
        });
    });

    socket.on('leaveQueue', () => {
        if (waiting && waiting.id === socket.id) waiting = null;
    });
});

function checkWinner(b) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const [a, b1, c] of lines) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));