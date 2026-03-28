const rows = 6;
const columns = 7;

let board = [];
let currColumns = [];
let currentPlayer = null;
let playerColor = null;
let computerColor = null;
let gameOver = false;

// UI elements
const welcome = document.getElementById("welcome");
const playBtn = document.getElementById("playBtn");

const setup = document.getElementById("setup");
const game = document.getElementById("game");
const boardEl = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");
const winnerEl = document.getElementById("winner");

// Play button → go to color selection
playBtn.addEventListener("click", () => {
    welcome.classList.add("hidden");
    setup.classList.remove("hidden");
});

// Color selection
document.querySelectorAll(".color-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        startGame(btn.dataset.color);
    });
});

function startGame(color) {
    playerColor = color;
    computerColor = (color === "Red") ? "Yellow" : "Red";

    currentPlayer = "Red"; // Red always starts
    gameOver = false;

    setup.classList.add("hidden");
    game.classList.remove("hidden");

    initBoard();
    updateTurnDisplay();

    if (currentPlayer === computerColor) {
        setTimeout(computerMove, 500);
    }
}

function initBoard() {
    board = [];
    currColumns = new Array(columns).fill(rows - 1);
    boardEl.innerHTML = "";
    winnerEl.innerText = "";

    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < columns; c++) {
            row.push(" ");

            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            tile.addEventListener("click", playerMove);
            boardEl.appendChild(tile);
        }

        board.push(row);
    }
}

function updateTurnDisplay() {
    turnDisplay.innerText = `${currentPlayer}'s Turn`;
}

function playerMove() {
    if (gameOver) return;
    if (currentPlayer !== playerColor) return;

    placePiece(this.id);
}

function computerMove() {
    if (gameOver) return;

    let availableCols = currColumns
        .map((r, c) => (r >= 0 ? c : null))
        .filter(c => c !== null);

    let c = availableCols[Math.floor(Math.random() * availableCols.length)];
    let r = currColumns[c];

    placePiece(`${r}-${c}`);
}

function placePiece(tileId) {
    const [rStr, cStr] = tileId.split("-");
    const c = parseInt(cStr);
    const r = currColumns[c];

    if (r < 0) return;

    board[r][c] = currentPlayer;

    const tile = document.getElementById(`${r}-${c}`);
    tile.classList.add(currentPlayer === "Red" ? "red-piece" : "yellow-piece");

    currColumns[c] = r - 1;

    if (checkWinner()) return;

    currentPlayer = (currentPlayer === "Red") ? "Yellow" : "Red";
    updateTurnDisplay();

    if (currentPlayer === computerColor) {
        setTimeout(computerMove, 500);
    }
}

function checkWinner() {
    // Horizontal →
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r][c+1] &&
                board[r][c+1] === board[r][c+2] &&
                board[r][c+2] === board[r][c+3]) {
                setWinner(r, c);
                return true;
            }
        }
    }

    // Vertical ↓
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r+1][c] &&
                board[r+1][c] === board[r+2][c] &&
                board[r+2][c] === board[r+3][c]) {
                setWinner(r, c);
                return true;
            }
        }
    }

    // Diagonal ↘
    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r+1][c+1] &&
                board[r+1][c+1] === board[r+2][c+2] &&
                board[r+2][c+2] === board[r+3][c+3]) {
                setWinner(r, c);
                return true;
            }
        }
    }

    // Diagonal ↗
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] !== " " &&
                board[r][c] === board[r-1][c+1] &&
                board[r-1][c+1] === board[r-2][c+2] &&
                board[r-2][c+2] === board[r-3][c+3]) {
                setWinner(r, c);
                return true;
            }
        }
    }

    return false;
}

function setWinner(r, c) {
    let winner = board[r][c];
    winnerEl.innerText = `${winner} Wins!`;
    gameOver = true;
}
