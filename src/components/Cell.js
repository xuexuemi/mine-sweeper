import React, { useRef } from "react";

function Cell(props) {
  const imgURL = useRef(null);

  function setStyle() {
    var bgColor = "#b0b0b0";

    switch (props.status) {
      case 2:
        imgURL.current = "/images/Minesweeper_0.svg.png";
        break;
      case 1:
        imgURL.current = "/images/Minesweeper_unopened_square.svg.png";
        break;
      case 0:
        imgURL.current = "/images/Minesweeper_" + props.tag + ".svg.png";
        break;
      case -2: // game over
        if (props.tag === 9) {
          imgURL.current = "/images/Minesweeper_9.svg.png";
          bgColor = "red"
        }
        break;
      case -4:
        imgURL.current = "/images/Minesweeper_9w.svg.png";
        break;

      case -1:
        imgURL.current = "/images/Minesweeper_flag.svg.png";
        break;
      
      default:
        break;
    }

    return {
      backgroundImage: "url(" + imgURL.current + ")",
      backgroundSize: "cover",
      backgroundColor: bgColor
    };
  }

  // disable context menu when right click
  function handleContextMenu(event) {
    event.preventDefault();
  }

  function handleMouseDown(event) {
    switch (event.buttons) {
      case 1:
        props.handleHold(props.row, props.col);
        props.setButtons(() => event.buttons);
        break;
      case 2:
        props.handleFlag(props.row, props.col);
        break;
      case 3:
        props.handleHoldNeighbors(props.row, props.col);
        props.setButtons(() => event.buttons);
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  function handleMouseOver(event) {
    switch (props.buttons) {
      case 1:
        props.handleHold(props.row, props.col);
        break;
      case 3:
        props.handleHoldNeighbors(props.row, props.col);
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  function handleMouseOut(event) {
    switch (props.buttons) {
      case 1:
        props.handleUnhold(props.row, props.col);
        break;
      case 3:
        props.handleUnholdNeighbors(props.row, props.col);
        break;
      default:
        break;
    }
    event.preventDefault();
  }

  function handleMouseUp(event) {
    switch (props.buttons) {
      case 1:
        props.handleGameStart();
        
        props.handleUnhold(props.row, props.col);
        props.handleReveal(props.row, props.col);
        break;
      case 3:
        props.handleUnholdNeighbors(props.row, props.col);
        props.handleRevealNeighbors(props.row, props.col);
        break;
      default:
        break;
    }

    props.setButtons(() => 0);

    event.preventDefault();
  }

  return (
    <div className="cell" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} onContextMenu={handleContextMenu} style={setStyle()}></div>
  );
}

export default Cell;
