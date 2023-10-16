const createBoardToPlaceShipsUI = () => {
  let occupiedCoordinates ={};
  const placeShipsDiv = document.querySelector("#place-ships");

  const createGameCell = (x, y) => {
    const cell = document.createElement("div");
    cell.style.width = `${placeShipsDiv.clientWidth / 10}px`;
    cell.style.height = `${placeShipsDiv.clientHeight / 10}px`;
    cell.id = `${x}${y}`;
    // cell.addEventListener("click", handleAttack);
    cell.classList.add("cell");
    cell.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    });

    cell.addEventListener("drop", (ev) => {
     
      // Get the id of the target and add the moved element to the target's DOM
      const shipName = ev.dataTransfer.getData("text/plain");
      const shipToMoveDiv = document.getElementById(shipName);
      const shipLength = shipToMoveDiv.dataset.length;
      const cellToOccupy = ev.target;

      const coordinateIsValid = (currentCoordinate) => {
        if (isNaN(currentCoordinate)) return false;
        //if coordinate is out of bounds from board
        if (currentCoordinate.length >= 3) return false;
        
        //if coordinate is already in list of occupied coordinates
        let occupiedCoordinatesValues = Object.values(occupiedCoordinates)
        if(occupiedCoordinatesValues==undefined){
          return
        }
        if(occupiedCoordinatesValues.flat().includes(currentCoordinate)){
          return false
        }

        return true;
      };

      const handleDrop = (cellToOccupy, shipLength) => {
        //go through the coordinates that the ship will occupy
        const allCellsTheShipWillOccupyIsValid = () => {
          const cellValidity = [];
          const coordinatesToPushIfValid = []
          for (let index = 0; index < shipLength; index++) {
            const currentCoordinate =
              +cellToOccupy.id[0] + index + cellToOccupy.id[1];

            cellValidity.push(coordinateIsValid(currentCoordinate));
            coordinatesToPushIfValid.push(currentCoordinate)
          }

          if (cellValidity.includes(false)) {
            return false;
          } else {
            //add coordinates if valid
            occupiedCoordinates[shipName] = coordinatesToPushIfValid
            return true
          }
        };

        if (allCellsTheShipWillOccupyIsValid()) {
          cellToOccupy.appendChild(shipToMoveDiv);
        }
        // console.log(allCellsTheShipWillOccupyIsValid());
      };
      // console.log(Object.values(occupiedCoordinates))
      handleDrop(cellToOccupy, shipLength);

      // console.log(occupiedCoordinates)
      // [+cellToOccupy.id[0]+shipLength-1+cellToOccupy.id[1], cellToOccupy.id]
      // console.log(occupiedCoordinates);

      // ev.target.appendChild(document.getElementById(data));
      // ev.dataTransfer.dropEffect = "none"
    });
    return cell;
  };

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = createGameCell(x, y);

      //   if (containsCoordinates(board.shipCoordinates, [x, y])) {
      //     cell.style.backgroundColor = "red";
      //   }

      placeShipsDiv.appendChild(cell);
    }
  }
};

const addListenersToShips = () => {
  function dragstart_handler(ev) {
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.dropEffect = "move";
  }

  const patrolBoat = document.querySelector("#patrol-boat");
  patrolBoat.addEventListener("dragstart", dragstart_handler);

  const submarine = document.querySelector("#submarine");
  submarine.addEventListener("dragstart", dragstart_handler);

  const destroyer = document.querySelector("#destroyer");
  destroyer.addEventListener("dragstart", dragstart_handler);

  const battleship = document.querySelector("#battleship");
  battleship.addEventListener("dragstart", dragstart_handler);

  const carrier = document.querySelector("#carrier");
  carrier.addEventListener("dragstart", dragstart_handler);
};
addListenersToShips();

export { createBoardToPlaceShipsUI };
