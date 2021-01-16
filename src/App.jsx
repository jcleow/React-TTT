/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';

// Display each button on the TTT board
function Button({
  squareNum, markings, setMarkings, changePlayer, updatePosMatrix, player,
}) {
  let isValidMove = false;
  const i = squareNum - 1;

  const changeMarking = () => {
    // Create a shallow copy of existing markings
    const updatedMarkings = [...markings];
    if (markings[i] === null) {
      isValidMove = true;
      if (player === 'X') {
        updatedMarkings[i] = 'X';
        setMarkings(updatedMarkings);
      } else if (player === 'O') {
        updatedMarkings[i] = 'O';
        setMarkings(updatedMarkings);
      }
    }
  };
  // useEffect(() => {
  //   updatePosMatrix(squareNum, markings);
  // });

  const buttonEventHandler = () => {
    changeMarking();
    if (isValidMove) {
      changePlayer();
    }
    console.log(markings, 'markings');
    updatePosMatrix(squareNum, markings[i]);
  };

  return (
    <button
      className="button"
      onClick={buttonEventHandler}
    >
      {markings[i]}
    </button>
  );
}

// Display winner
function Winner({ winner }) {
  return (
    <div>
      {winner ? `${winner} is the winner` : 'There is no winner'}
    </div>
  );
}

function ResetGameButton({ resetMatrix }) {
  return (
    <div>
      <button onClick={() => { resetMatrix(); }}>Reset</button>
    </div>

  );
}

// Display the Board component
function Board() {
  // Basic set up of board matrix using 2D arrays
  const boardMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // Defining the (use)State of the board
  // posMatrix is a replica of boardMatrix but with 'X' and 'O' positions
  const [posMatrix, setPosMatrix] = useState(boardMatrix);
  const [markings, setMarkings] = useState(Array(9).fill(null));

  // Function that updates the TTT (marking) in our TTT position matrix
  const updatePosMatrix = (squareNum, updatedMarking) => {
    posMatrix.forEach((row, index) => {
      if (row.includes(squareNum)) {
        console.log(squareNum, 'squareNum');
        console.log(updatedMarking, 'updatedMarkings');
        posMatrix[index][row.indexOf(squareNum)] = updatedMarking;
        setPosMatrix(posMatrix);
      }
    });
  };

  // Function that resets the TTT board position matrix
  const resetMatrix = () => {
    setPosMatrix(boardMatrix);
    console.log(posMatrix, 'posMatrix-2');
  };

  // Defining the (use)State of the player for the board
  const [player, setPlayer] = useState('X');
  // Function that changes the state of the player that will be changed after a button is clicked
  const changePlayer = () => {
    // Only Change player if button's state remains undefined
    if (player === 'X') {
      setPlayer('O');
    } else {
      setPlayer('X');
    }
  };

  // Rendering 3 rows of buttons
  const squareButtonsArray = boardMatrix.map((row, index) => {
    const rowOfButtons = row.map((num) => (
      <Button
        key={num}
        squareNum={num}
        markings={markings}
        setMarkings={setMarkings}
        changePlayer={changePlayer}
        updatePosMatrix={updatePosMatrix}
        player={player}
      />
    ));
    // Rendering 1 row of buttons
    const rowEl = (
      <div key={`row-${index}`} className="row">
        <div className="col">
          {rowOfButtons}
        </div>
      </div>
    );
    return rowEl;
  });

  function checkWin() {
    let winner;
    // Check horizontally
    posMatrix.forEach((row) => {
      const consecMatch = row.filter((el) => row[0] === el);
      if (consecMatch.length === 3) {
        [winner] = row;
      }
    });
    // Check vertically
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        if (posMatrix[j][i] !== posMatrix[j + 1][i]) {
          break;
        }
        if (j === 1) {
          winner = posMatrix[j][i];
        }
      }
    }
    // Check from Top Left to Bottom Right Diagonally
    // [0,0] - [1,1] - [2,2]
    for (let i = 0; i < 2; i += 1) {
      if (posMatrix[i][i] !== posMatrix[i + 1][i + 1]) {
        break;
      }
      if (i === 1) {
        winner = posMatrix[i][i];
      }
    }

    // Check from Top Right to Bottom Left Diagonally
    // [0,2] - [1,1] - [2,0]
    for (let i = 0; i < 2; i += 1) {
      const y = posMatrix[i].length - 1 - i;
      if (posMatrix[i][y] !== posMatrix[i + 1][y - 1]) {
        break;
      }
      if (i === 1) {
        winner = posMatrix[i][y];
      }
    }
    if (winner) {
      return winner;
    }
  }
  const winner = checkWin();

  const winnerEl = (
    <Winner winner={winner} />
  );
  const resetGameBtnEl = (
    <ResetGameButton resetMatrix={resetMatrix} />
  );

  const displayBoard = [...squareButtonsArray, winnerEl, resetGameBtnEl];

  // Return all 3 rows of the board
  return displayBoard;
}

export default function App() {
  return (
    <div className="Container">
      <Board />
    </div>
  );
}
