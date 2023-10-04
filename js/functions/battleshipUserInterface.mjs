const createBoardUI = (boardType, board, ships, boardUI) => {
  const containsCoordinates = (shipCoordinates, coordinatesToFind) => {
    return shipCoordinates.some((arr) =>
      coordinatesToFind.every((value, index) => arr[index] === value)
    );
  };

  const handleAttack = (e) => {
    const xCoordinate = +e.target.id[0];
    const yCoordinate = +e.target.id[1];
    const cellToUpdate = boardUI.querySelector(`[id="${xCoordinate}${yCoordinate}"]`);

    const attackResult = board.receiveAttack(xCoordinate, yCoordinate, ships);
    if (attackResult === "Hit!") {
      cellToUpdate.style.backgroundColor = "black";
      cellToUpdate.removeEventListener("click", handleAttack);
      if (board.checkIfAllShipsAreSunk()) {
        const cells = boardUI.querySelectorAll("*");
        cells.forEach((cell) => {
          cell.removeEventListener("click", handleAttack);
        });
        return console.log(`Game over, ${boardType} wins`);
      }
    } else if (attackResult === "Miss!") {
      cellToUpdate.style.backgroundColor = "white";
      cellToUpdate.removeEventListener("click", handleAttack);
    }
  };

  const createGameCell = (x, y) => {
    const cell = document.createElement("div");
    cell.style.width = `${boardUI.clientWidth / 10}px`;
    cell.style.height = `${boardUI.clientHeight / 10}px`;
    cell.id = `${x}${y}`;
    cell.addEventListener("click", handleAttack);
    return cell;
  };

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = createGameCell(x, y);

      if (containsCoordinates(board.shipCoordinates, [x, y])) {
        cell.style.backgroundColor = "red";
      }

      boardUI.appendChild(cell);
    }
  }

  return boardUI;
};



// Create player board
// const createPlayerBoard = createGameBoard("player", player, playerShips, playerBoardUI);

// // Create enemy board
// const createEnemyBoard = createGameBoard("enemy", enemy, enemyShips, enemyBoardUI);

export {createBoardUI}


