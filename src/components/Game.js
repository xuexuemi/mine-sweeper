import React, { useState, useRef, useEffect } from "react";
import Board from "./Board";

function Game() {
  const neighbors = [
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  const isFirstRender = useRef(true);

  const gameHasStarted = useRef(null);
  const timerID = useRef(null);
  const [time, setTime] = useState(0);

  const [gameMode, setGameMode] = useState("beginner");
  const [numRows, setNumRows] = useState(9);
  const [numCols, setNumCols] = useState(9);
  const [numMines, setNumMines] = useState(10);

  const [numMinesLeft, setNumMinesLeft] = useState(10);
  const [numFlagsLeft, setNumFlagsLeft] = useState(10);

  const [cellStatus, setCellStatus] = useState([]);
  const [cellTags, setCellTags] = useState([]);

  function initBoard(event) {
    
    setGameMode(event.target.value);

    switch (event.target.value) {
      case "beginner":
        setNumRows(9);
        setNumCols(9);
        setNumMines(10);
        break;

      case "intermediate":
        setNumRows(16);
        setNumCols(16);
        setNumMines(40);
        break;

      case "expert":
        setNumRows(16);
        setNumCols(30);
        setNumMines(99);
        break;
    }

    //event.preventDefault();
  }

  useEffect(() => {
    if (!isFirstRender.current) {
      newGame();
    }
    
  }, [numMines]);

  useEffect(() => {
    isFirstRender.current = false;
    newGame();
  }, []);

  function newGame() {
    var status = [];
    var mines = [];
    var tags = [];

    for (var i = 0; i < numRows; i++) {
      var statusRow = [];
      var minesRow = [];
      var tagsRow = [];

      for (var j = 0; j < numCols; j++) {
        statusRow.push(1);
        minesRow.push(0);
        tagsRow.push(0);
      }
      status.push(statusRow);
      mines.push(minesRow);
      tags.push(tagsRow);
    }

    // set tag = 1 indicating hasMine is true
    var countMines = 0;
    while (countMines < numMines) {
      var k = Math.floor(Math.random() * numCols * numRows);

      var i = Math.floor(k / numCols);
      var j = Math.floor(k % numCols);

      if (mines[i][j] === 1) {
        continue;
      }

      mines[i][j] = 1;
      countMines++;
    }

    // update tag

    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        if (mines[i][j] === 1) {
          tags[i][j] = 9;
        } else {
          var numNeighborMines = 0;

          for (var k = 0; k < 8; k++) {
            var new_i = i + neighbors[k][0];
            var new_j = j + neighbors[k][1];

            if (new_i >= 0 && new_i < numRows && new_j >= 0 && new_j < numCols) {
              numNeighborMines = numNeighborMines + mines[new_i][new_j];
            }
          }

          tags[i][j] = numNeighborMines;
        }
      }
    }

    setCellStatus(status);
    setCellTags(tags);

    gameHasStarted.current = false;
    clearInterval(timerID.current);
    setTime(0);
    setNumFlagsLeft(numMines);
    setNumMinesLeft(numMines);
  }

  function gameStart() {
    if (!gameHasStarted.current) {
      gameHasStarted.current = true;
      timerID.current = setInterval(() => {
        setTime(c => c + 1);
      }, 1000);
    }
  }

  function gameOver(content) {
    clearInterval(timerID.current);
    console.log(content);

    // lock the board
    setCellStatus(prevStatus => {
      var status = prevStatus.slice();
      status = status.map((statusRow, i) => {
        return statusRow.map((statusCell, j) => {
          if (statusCell != 0) {
            if (cellTags[i][j] === 9) {
              if (statusCell == -1) {
                return -3;
              } else {
                return 0;
              }
            } else {
              if (statusCell == -1) {
                return -4;
              } else {
                return -2;
              }
            }
          } else {
            return 0;
          }
        });
      });

      return status;
    });
  }

  return (
    <div>
      <form onChange={initBoard}>
        <input type="radio" id="beginner" value="beginner" checked={gameMode === "beginner"} />
        <label for="beginner">Beginner</label>

        <input type="radio" id="intermediate" value="intermediate" checked={gameMode === "intermediate"} />
        <label for="intermediate">Intermediate</label>

        <input type="radio" id="expert" value="expert" checked={gameMode === "expert"} />
        <label for="expert">Expert</label>
      </form>

      <input type="text" value={numFlagsLeft} />
      <button onClick={newGame}>Reset</button>
      <input type="text" value={time} />

      <Board
        neighbors={neighbors}
        numRows={numRows}
        numCols={numCols}
        numMines={numMines}
        cellTags={cellTags}
        cellStatus={cellStatus}
        setCellStatus={setCellStatus}
        setNumMinesLeft={setNumMinesLeft}
        setNumFlagsLeft={setNumFlagsLeft}
        handleGameStart={gameStart}
        handleGameOver={gameOver}
      />
    </div>
  );
}

export default Game;
