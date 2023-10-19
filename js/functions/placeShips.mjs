import { showStartGameButton } from "./game.mjs";

const occupiedCoordinates = {};

const getOccupiedCoordinates = () => {

  return occupiedCoordinates;
};

const addListenersToShips = () => {
  function dragstart_handler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
  }

  const shipIds = [
    "patrol-boat",
    "submarine",
    "destroyer",
    "battleship",
    "carrier",
  ];
  shipIds.forEach((shipId) => {
    const ship = document.querySelector(`#${shipId}`);
    ship.addEventListener("dragstart", dragstart_handler);
  });
};

const createBoardToPlaceShipsUI = () => {
  const placeShipsDiv = document.querySelector("#place-ships");
  const rotateButton = document.querySelector("#rotate");
  const shipsContainerDiv = document.querySelector("#ships-container");
  let isVertical = false;

  // Function to toggle the ship orientation
  const toggleOrientation = () => {
    const shipContainer = document.querySelector("#ships-container");
    const remainingShips = [...shipContainer.children];
    remainingShips.forEach((ship) => {
      ship.classList.toggle("vertical");
    });
    isVertical = !isVertical;
  };

  // Add a click event listener to the rotate button
  rotateButton.addEventListener("click", toggleOrientation);

  // Function to create a game cell
  const createGameCell = (x, y) => {
    const cell = document.createElement("div");
    const cellSize = `${placeShipsDiv.clientWidth / 10}px`;
    cell.style.width = cellSize;
    cell.style.height = cellSize;
    cell.id = `${x}${y}`;
    cell.classList.add("cell");

    cell.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    });

    const dropHandler = (ev) => {
      const shipName = ev.dataTransfer.getData("text/plain");
      const shipToMoveDiv = document.getElementById(shipName);
      const shipLength = shipToMoveDiv.dataset.length;
      const cellToOccupy = ev.target;

      const coordinateIsValid = (currentCoordinate) => {
        if (isNaN(currentCoordinate) || currentCoordinate.length >= 3) {
          return false;
        }
        const occupiedCoordinatesValues =
          Object.values(occupiedCoordinates).flat();
        return !occupiedCoordinatesValues.includes(currentCoordinate);
      };

      const allShipsArePlaced = () => {
        if (shipsContainerDiv.children.length == 0) return true;
        return false;
      };

      const allCellsTheShipWillOccupyIsValid = () => {
        const coordinatesToPushIfValid = [];
        for (let index = 0; index < shipLength; index++) {
          let currentCoordinate = isVertical
            ? cellToOccupy.id[0] + (+cellToOccupy.id[1] + index)
            : +cellToOccupy.id[0] + index + cellToOccupy.id[1];
          coordinatesToPushIfValid.push(currentCoordinate);
          if (!coordinateIsValid(currentCoordinate)) {
            return false;
          }
        }
        occupiedCoordinates[shipName] = [
          ...coordinatesToPushIfValid,
          isVertical,
        ];
        return true;
      };

      if (allCellsTheShipWillOccupyIsValid()) {
        cellToOccupy.appendChild(shipToMoveDiv);
        if (allShipsArePlaced()) {
          showStartGameButton();
        }
      }
    };

    cell.addEventListener("drop", dropHandler);

    return cell;
  };

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = createGameCell(x, y);
      placeShipsDiv.appendChild(cell);
    }
  }
};

addListenersToShips();

export { createBoardToPlaceShipsUI, getOccupiedCoordinates };
