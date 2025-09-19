import React, { useEffect, useRef, useState } from 'react';
import Board from './Board';

function Game() {
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [vsComputer, setVsComputer] = useState(false); // Computer plays as 'O'
    const aiTimeoutRef = useRef(null);
    const [showWinModal, setShowWinModal] = useState(false);
    const lastWinnerRef = useRef(null);
    const [showDrawModal, setShowDrawModal] = useState(false);
    const drawShownRef = useRef(false);

    const resetBoard = () => {
        // cancel any pending AI
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }
        setHistory([{ squares: Array(9).fill(null) }]);
        setStepNumber(0);
        setXIsNext(true);
        setShowWinModal(false);
        setShowDrawModal(false);
        lastWinnerRef.current = null;
    };

    const newGame = () => {
        resetBoard();
        // Return to default mode (player vs player)
        setVsComputer(false);
    };

    const handleClick = (i) => {
        const currentHistory = history.slice(0, stepNumber + 1);
        const current = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();

        // Return early if someone has won or the square is already filled
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        // Prevent human from playing on computer's turn
        if (vsComputer && !xIsNext) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';

        setHistory(currentHistory.concat([{
            squares: squares,
        }]));
        setStepNumber(currentHistory.length);
        setXIsNext(!xIsNext);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    };

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (!winner && history[stepNumber].squares.every((sq) => sq !== null)) {
        status = 'Game ended in a draw!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // Open modal when a new winner is detected
    useEffect(() => {
        if (winner && lastWinnerRef.current !== winner) {
            setShowWinModal(true);
            lastWinnerRef.current = winner;
        }
        if (!winner) {
            lastWinnerRef.current = null;
            setShowWinModal(false);
        }
    }, [winner]);

    // Show draw modal when board is full and there's no winner
    useEffect(() => {
        const current = history[stepNumber];
        const isDraw = !winner && current.squares.every((sq) => sq !== null);
        if (isDraw && !drawShownRef.current) {
            setShowDrawModal(true);
            drawShownRef.current = true;
        }
        if (!isDraw) {
            setShowDrawModal(false);
            drawShownRef.current = false;
        }
    }, [history, stepNumber, winner]);

    // Auto-play computer move (computer is 'O')
    useEffect(() => {
        // Clear any pending AI move when dependencies change
        if (aiTimeoutRef.current) {
            clearTimeout(aiTimeoutRef.current);
            aiTimeoutRef.current = null;
        }

        if (!vsComputer) return; // Not in vs-computer mode
        const current = history[stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares)) return; // Game already won

        const emptyLeft = squares.some((sq) => sq === null);
        if (!emptyLeft) return; // Draw / no moves left

        // Computer plays when it's O's turn (i.e., not X's turn)
        if (!xIsNext) {
            aiTimeoutRef.current = setTimeout(() => {
                const move = getBestMove(squares, 'O');
                if (move != null) {
                    const currentHistory = history.slice(0, stepNumber + 1);
                    const current = currentHistory[currentHistory.length - 1];
                    const nextSquares = current.squares.slice();
                    // If cell already filled (rare race), bail
                    if (nextSquares[move]) return;
                    nextSquares[move] = 'O';
                    setHistory(currentHistory.concat([{ squares: nextSquares }]));
                    setStepNumber(currentHistory.length);
                    setXIsNext(true);
                }
            }, 300);
        }

        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
                aiTimeoutRef.current = null;
            }
        };
    }, [history, stepNumber, xIsNext, vsComputer]);

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={handleClick}
                />
            </div>
            <div className="game-info">
                <div style={{ marginBottom: 8 }}>
                    <button onClick={() => setVsComputer((v) => !v)}>
                        {vsComputer ? 'Playing vs Computer (O)' : 'Play vs Computer'}
                    </button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <button onClick={resetBoard}>Reset</button>
                    <button onClick={newGame}>New Game</button>
                </div>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>

            {showWinModal && winner && (
                <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Game result">
                    <div className="modal-card">
                        <h2 style={{ marginTop: 0 }}>Winner</h2>
                        <p style={{ fontSize: 18, margin: '8px 0 16px' }}>
                            {winner} wins!
                        </p>
                        <div className="modal-actions">
                            <button onClick={() => setShowWinModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showDrawModal && !winner && (
                <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Game result">
                    <div className="modal-card">
                        <h2 style={{ marginTop: 0 }}>Draw</h2>
                        <p style={{ fontSize: 18, margin: '8px 0 16px' }}>
                            It's a tie. No more moves left.
                        </p>
                        <div className="modal-actions" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                            <button onClick={() => setShowDrawModal(false)}>Close</button>
                            <button onClick={resetBoard}>Play Again</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to determine the winner
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// Simple AI: try to win, block, take center, corner, then side.
function getBestMove(squares, ai) {
    const human = ai === 'X' ? 'O' : 'X';
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Helper to test a move
    const checkWin = (board, player) => {
        for (let [a, b, c] of lines) {
            if (board[a] === player && board[b] === player && board[c] === player) {
                return true;
            }
        }
        return false;
    };

    const empties = [];
    for (let i = 0; i < 9; i++) if (!squares[i]) empties.push(i);

    // 1) Win if possible
    for (let i of empties) {
        const copy = squares.slice();
        copy[i] = ai;
        if (checkWin(copy, ai)) return i;
    }

    // 2) Block if human can win
    for (let i of empties) {
        const copy = squares.slice();
        copy[i] = human;
        if (checkWin(copy, human)) return i;
    }

    // 3) Take center
    if (empties.includes(4)) return 4;

    // 4) Take a corner
    const corners = [0, 2, 6, 8].filter((i) => empties.includes(i));
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    // 5) Take a side
    const sides = [1, 3, 5, 7].filter((i) => empties.includes(i));
    if (sides.length) return sides[Math.floor(Math.random() * sides.length)];

    return null;
}

export default Game;