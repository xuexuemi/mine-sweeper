import React, { useState, useRef } from "react";
import Cell from "./Cell";

function Board(props) {
  var i = 0;
  var j = 0;
  var k = 0;
  
  const [buttons, setButtons] = useState(0);

  
  function reveal(rowIndex, columnIndex) {
    props.setCellStatus(prevStatus => {
      var status = prevStatus.slice();

      if (status[rowIndex][columnIndex] === 1) {
        if (props.cellTags[rowIndex][columnIndex] === 9) {
          // game over
          props.handleGameOver(false,rowIndex, columnIndex);
        } else {
          var stack = [[rowIndex, columnIndex]];

          while (stack.length > 0) {
            [i, j] = stack.shift();
            status[i][j] = 0;
            //props.countRevealedCells();

            if (props.cellTags[i][j] === 0) {
              for (k = 0; k < 8; k++) {
                var new_i = i + props.neighbors[k][0];
                var new_j = j + props.neighbors[k][1];

                if (new_i >= 0 && new_i < props.numRows && new_j >= 0 && new_j < props.numCols && status[new_i][new_j] === 1) {
                  stack.push([new_i, new_j]);
                }
              }
            }
          }
        }
      }
      return status;
    });
  }

  function hold(rowIndex, columnIndex) {
    props.setCellStatus(prevStatus => {
      var status = prevStatus.slice();

      if (status[rowIndex][columnIndex] === 1) {
        status[rowIndex][columnIndex] = 2;
      }
      return status;
    });
  }

  function holdNeighbors(rowIndex, columnIndex) {
    if (props.cellStatus[rowIndex][columnIndex] === 0) {
      for (k = 0; k < 8; k++) {
        i = rowIndex + props.neighbors[k][0];
        j = columnIndex + props.neighbors[k][1];

        if (i >= 0 && i < props.numRows && j >= 0 && j < props.numCols && props.cellStatus[i][j] === 1) {
          hold(i, j);
        }
      }
    }
  }

  function unhold(rowIndex, columnIndex) {
    props.setCellStatus(prevStatus => {
      var status = prevStatus.slice();

      if (status[rowIndex][columnIndex] === 2) {
        status[rowIndex][columnIndex] = 1;
      }
      return status;
    });
  }

  function unholdNeighbors(rowIndex, columnIndex) {
    unhold(rowIndex, columnIndex);

    for (k = 0; k < 8; k++) {
      i = rowIndex + props.neighbors[k][0];
      j = columnIndex + props.neighbors[k][1];

      if (i >= 0 && i < props.numRows && j >= 0 && j < props.numCols && props.cellStatus[i][j] === 2) {
        unhold(i, j);
      }
    }
  }

  function flag(rowIndex, columnIndex) {
    props.setCellStatus(prevStatus => {
      var status = prevStatus.slice();

      if (status[rowIndex][columnIndex] === 1) {
        status[rowIndex][columnIndex] = -1;

        props.setNumFlagsLeft(c => c - 1);

        if (props.cellTags[rowIndex][columnIndex] === 9) {
          props.setNumMinesLeft(c => {
            // check if game is over
            if (c === 1) {
              props.handleGameOver(true, rowIndex, columnIndex);
            }

            return c - 1;
          });
        }
      } else if (status[rowIndex][columnIndex] === -1) {
        status[rowIndex][columnIndex] = 1;
        props.setNumFlagsLeft(c => c + 1);

        if (props.cellTags[rowIndex][columnIndex] === 9) {
          props.setNumMinesLeft(c => c + 1);
        }
      }
      return status;
    });
    
  }

  function revealNeighbors(rowIndex, columnIndex) {
    props.setCellStatus(prevStatus => {
      var status = prevStatus.slice();

      if (status[rowIndex][columnIndex] === 0) {
        var numFlags = 0;
        for (k = 0; k < 8; k++) {
          i = rowIndex + props.neighbors[k][0];
          j = columnIndex + props.neighbors[k][1];

          if (i >= 0 && i < props.numRows && j >= 0 && j < props.numCols && status[i][j] === -1) {
            numFlags++;
          }
        }

        if (numFlags === props.cellTags[rowIndex][columnIndex]) {
          var mineIndex = [];

          for (k = 0; k < 8; k++) {
            i = rowIndex + props.neighbors[k][0];
            j = columnIndex + props.neighbors[k][1];

            if (i >= 0 && i < props.numRows && j >= 0 && j < props.numCols && status[i][j] === 1) {
              if (mineIndex.length === 0 && props.cellTags[i][j] === 9) {
                mineIndex = [i, j];
              }

              var stack = [[i, j]];

              while (stack.length > 0) {
                var [i, j] = stack.shift();
                status[i][j] = 0;

                if (props.cellTags[i][j] === 0) {
                  for (k = 0; k < 8; k++) {
                    var new_i = i + props.neighbors[k][0];
                    var new_j = j + props.neighbors[k][1];

                    // some issue because of unfolding (setState asynchronic)
                    if (new_i >= 0 && new_i < props.numRows && new_j >= 0 && new_j < props.numCols && status[new_i][new_j] >= 1) {
                      stack.push([new_i, new_j]);
                    }
                  }
                }
              }
            }
          }

          if (mineIndex.length > 0) {
            props.handleGameOver(false,mineIndex[0],mineIndex[1]);
          }
        }
      }
      return status;
    });
  }

  return (
    <div className="board">
      
      {props.cellTags.map((rowTags, rowIndex) => {
        return (
          <div className="row">
            {rowTags.map((tag, columnIndex) => {
              return (
                <Cell
                  key={rowIndex * 10 + columnIndex}
                  row={rowIndex}
                  col={columnIndex}
                  tag={tag}
                  status={props.cellStatus[rowIndex][columnIndex]}
                  buttons={buttons}
                  setButtons={setButtons}
                  handleReveal={reveal}
                  handleFlag={flag}
                  handleHold={hold}
                  handleUnhold={unhold}
                  handleHoldNeighbors={holdNeighbors}
                  handleUnholdNeighbors={unholdNeighbors}
                  handleRevealNeighbors={revealNeighbors}
                  handleGameStart={() => props.handleGameStart()}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Board;
