#!/usr/bin/env node

import readline from "readline";
import chalk from "chalk";
import boxen from "boxen";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let boardSize = 0;
const board = [];

const initializeBoard = function () {
    board.length = boardSize ** 2;
    board.fill(" ");
};

const askForBoardSize = function () {
    rl.question("Enter board size (minimum 3): ", function (input) {
        boardSize = parseInt(input);
        if (boardSize >= 3) {
            initializeBoard();
            startGame();
        } else {
            console.log("Invalid board size. Please enter a size of 3 or greater.");
            askForBoardSize();
        }
    });
};

const drawBoard = function () {
    const horizontalLine = "-".repeat(boardSize * 4.7 - 1);
    let boardContent = "";

    for (let i = 0; i < boardSize; i++) {
        let row = "|";
        for (let j = 0; j < boardSize; j++) {
            const index = i * boardSize + j;
            const cell = board[index] !== " " ? board[index] : " ";
            row += ` ${cell} |`;
        }
        boardContent += `${row}\n${horizontalLine}\n`;
    }

    return boardContent;
};

const checkForWin = function (player) {
    // Check rows
    for (let i = 0; i < boardSize; i++) {
        let win = true;
        for (let j = 0; j < boardSize; j++) {
            if (board[i * boardSize + j] !== player) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    // Check columns
    for (let i = 0; i < boardSize; i++) {
        let win = true;
        for (let j = 0; j < boardSize; j++) {
            if (board[j * boardSize + i] !== player) {
                win = false;
                break;
            }
        }
        if (win) {
            return true;
        }
    }

    // Check diagonals
    let win = true;
    for (let i = 0; i < boardSize; i++) {
        if (board[i * boardSize + i] !== player) {
            win = false;
            break;
        }
    }
    if (win) {
        return true;
    }

    win = true;
    for (let i = 0; i < boardSize; i++) {
        if (board[i * boardSize + (boardSize - 1 - i)] !== player) {
            win = false;
            break;
        }
    }
    if (win) {
        return true;
    }

    return false;
};

const startGame = function () {
    console.log(chalk.bgWhite("--"));
    console.clear();
    const gameTitle = boxen(chalk.cyanBright.bold("Tic Tac Toe"), {
        padding: 0,
        margin: 0,
        borderColor: "magentaBright",
    });
    const boardContent = drawBoard();
    const gameBoxContent = gameTitle + "\n" + chalk.blackBright(boardContent);

    const gameBox = boxen(gameBoxContent, {
        padding: 10,
        margin: 5,
        borderStyle: "round",
    });

    console.log(gameBox);

    let player = chalk.bold.yellowBright("X");

    const makeMove = function () {
        rl.question(
            `Player ${player}, enter your move (1-${boardSize ** 2}): `,
            function (input) {
                let move = parseInt(input) - 1;

                if (move >= 0 && move < boardSize ** 2 && board[move] === " ") {
                    board[move] = player;
                } else {
                    console.error(chalk.bgRed("✖ Invalid move"));
                    makeMove(); // Ask the same player again for a valid move
                    return;
                }

                console.clear();
                const gameTitle = boxen(
                    chalk.blueBright.bold("Tic Tac Toe"),

                    {
                        padding: 0,
                        margin: 0,
                        borderColor: "magentaBright",
                    }
                );
                const newBoardContent = drawBoard();
                const newGameBoxContent =
                    gameTitle + "\n" + chalk.blackBright(newBoardContent);

                const newGameBox = boxen(newGameBoxContent, {
                    padding: 10,
                    margin: 5,
                    borderColor: "magenta",
                    borderStyle: "round",
                });

                console.log(newGameBox);

                if (checkForWin(player)) {
                    const winResult = boxen(
                        chalk.bold.cyan(`🎉Congratulations! Player ${player} wins!🎉`),
                        {
                            padding: 1,
                            margin: 1,
                            borderStyle: "round",
                        }
                    );
                    console.log(winResult);
                    rl.close();
                    return;
                }

                if (board.includes(" ")) {
                    player =
                        player === chalk.bold.yellowBright("X")
                            ? chalk.bold.greenBright("O")
                            : chalk.bold.yellowBright("X");
                    makeMove(); // Ask the next player for a move
                } else {
                    console.log("It's a tie!");
                    rl.close();
                }
            }
        );
    };

    makeMove(); // Start the first move
};

console.log("Welcome to Tic Tac Toe!");
askForBoardSize();
