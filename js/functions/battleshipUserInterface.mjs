const createBoardUI = (boardType, board, ships, boardUI) => {
  const containsCoordinates = (shipCoordinates, coordinatesToFind) => {
    return shipCoordinates.some((arr) =>
      coordinatesToFind.every((value, index) => arr[index] === value)
    );
  };

  const createGameCell = (x, y) => {
    const cell = document.createElement("div");
    cell.style.width = `${boardUI.clientWidth / 10}px`;
    cell.style.height = `${boardUI.clientHeight / 10}px`;
    cell.id = `${x}${y}`;
    // cell.addEventListener("click", handleAttack);
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

const updateCellColor = (x, y, boardOwner, result) => {
  if (boardOwner == "enemy") {
    const boardToUpdate = document.querySelector("#enemy-board");
    const cellToUpdate = boardToUpdate.querySelector(`[id="${x}${y}"]`);
    if (result == "Hit!") {
      cellToUpdate.style.removeProperty("background-color");
      cellToUpdate.classList.add("hit");
    }
    if (result == "Miss!") {
      cellToUpdate.style.removeProperty("background-color");
      cellToUpdate.classList.add("miss");
    }
  }

  if (boardOwner == "player") {
    const boardToUpdate = document.querySelector("#player-board");
    const cellToUpdate = boardToUpdate.querySelector(`[id="${x}${y}"]`);
    if (result == "Hit!") {
      cellToUpdate.style.removeProperty("background-color");
      cellToUpdate.classList.add("hit");
    }
    if (result == "Miss!") {
      cellToUpdate.style.removeProperty("background-color");
      cellToUpdate.classList.add("miss");
    }
  }
};


export { createBoardUI, updateCellColor };
