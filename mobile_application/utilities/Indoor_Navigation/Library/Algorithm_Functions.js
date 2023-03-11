import { dijkstraAlgo } from "./algorithms/dijkstraAlgo";

function getDirections(tempNodes) {
  let next = null;
  for (let i = 0; i < tempNodes.length - 1; i++) {
    if (i == 0) {
      let [row1, col1] = [tempNodes[i].row, tempNodes[i].col];
      let [row2, col2] = [tempNodes[i + 1].row, tempNodes[i + 1].col];
      if (row1 == row2) {
        if (col1 < col2) {
          tempNodes[i].direction = "right";
        } else {
          tempNodes[i].direction = "left";
        }
      } else if (col1 == col2) {
        if (row1 < row2) {
          tempNodes[i].direction = "down";
        } else {
          tempNodes[i].direction = "up";
        }
      }
    } else {
      let [row1, col1] = [tempNodes[i].row, tempNodes[i].col];
      let [row2, col2] = [tempNodes[i + 1].row, tempNodes[i + 1].col];
      if (tempNodes[i - 1].direction == "right") {
        if (row1 == row2) {
          if (col1 < col2) {
            tempNodes[i].direction = "right";
            tempNodes[i].userDirection = "";
          } else {
            tempNodes[i].direction = "left";
            tempNodes[i].userDirection = "";
          }
        } else if (col1 == col2) {
          if (row1 < row2) {
            tempNodes[i].direction = "down";
            tempNodes[i].userDirection = "right";
          } else {
            tempNodes[i].direction = "up";
            tempNodes[i].userDirection = "left";
          }
        }
      } else if (tempNodes[i - 1].direction == "left") {
        if (row1 == row2) {
          if (col1 < col2) {
            tempNodes[i].direction = "right";
            tempNodes[i].userDirection = "";
          } else {
            tempNodes[i].direction = "left";
            tempNodes[i].userDirection = "";
          }
        } else if (col1 == col2) {
          if (row1 < row2) {
            tempNodes[i].direction = "down";
            tempNodes[i].userDirection = "left";
          } else {
            tempNodes[i].direction = "up";
            tempNodes[i].userDirection = "right";
          }
        }
      } else if (tempNodes[i - 1].direction == "up") {
        if (row1 == row2) {
          if (col1 < col2) {
            tempNodes[i].direction = "right";
            tempNodes[i].userDirection = "right";
          } else {
            tempNodes[i].direction = "left";
            tempNodes[i].userDirection = "left";
          }
        } else if (col1 == col2) {
          if (row1 < row2) {
            tempNodes[i].direction = "down";
            tempNodes[i].userDirection = "";
          } else {
            tempNodes[i].direction = "up";
            tempNodes[i].userDirection = "";
          }
        }
      } else if (tempNodes[i - 1].direction == "down") {
        if (row1 == row2) {
          if (col1 < col2) {
            tempNodes[i].direction = "right";
            tempNodes[i].userDirection = "left";
          } else {
            tempNodes[i].direction = "left";
            tempNodes[i].userDirection = "right";
          }
        } else if (col1 == col2) {
          if (row1 < row2) {
            tempNodes[i].direction = "down";
            tempNodes[i].userDirection = "";
          } else {
            tempNodes[i].direction = "up";
            tempNodes[i].userDirection = "";
          }
        }
      }
    }
  }
  return tempNodes;
}

// try to get a return first

const solveTheGrid = () => {
  // make a deep copy of the grid
  // let deep_clone_grid = cloneDeep(grid);
  // setPreviousGrid(deep_clone_grid);

  const [shortPathList, listOfAllNodes, solvedGrid] = dijkstraAlgo(
    grid,
    initializedPosition
  );
  setGrid(solvedGrid);
  // create nodes with row and col as well as direction from the shortPathList
  let tempNodes = [];
  for (let i = 0; i < shortPathList.length; i++) {
    let [row, col] = shortPathList[i];
    tempNodes.push({
      key: i + 1,
      row: row,
      col: col,
      direction: null,
      userDirection: "",
    });
  }

  let sortedNodes = tempNodes.sort((a, b) => a.key - b.key);
  // remove the last node
  let nodes = getDirections(sortedNodes);
  nodes = nodes.sort((a, b) => a.key - b.key);
  let last_node = nodes[nodes.length - 1];
  // check the last node and set the direction using the start node
  if (last_node.direction == "right") {
    if (last_node.col < initializedPosition.col) {
      last_node.userDirection = "left";
    } else {
      last_node.userDirection = "right";
    }
  } else if (last_node.direction == "left") {
    if (last_node.col < initializedPosition.col) {
      last_node.userDirection = "left";
    } else {
      last_node.userDirection = "right";
    }
  } else if (last_node.direction == "up") {
    if (last_node.row < initializedPosition.row) {
      last_node.userDirection = "left";
    }
    if (last_node.row > initializedPosition.row) {
      last_node.userDirection = "right";
    }
  } else if (last_node.direction == "down") {
    if (last_node.row < initializedPosition.row) {
      last_node.userDirection = "right";
    }
    if (last_node.row > initializedPosition.row) {
      last_node.userDirection = "left";
    }
  }
  for (let row = 0; row < listOfAllNodes.length; row++) {
    setTimeout(() => {
      const node = listOfAllNodes[row];
      changeColor(node[0], node[1], "visual");
    }, 1 * row);
  }

  // filter currentSelectedPredefinedMarkers with is_target_location false
  let temp = {};
  for (var key in currentSelectedPredefinedMarkers) {
    if (currentSelectedPredefinedMarkers[key].is_target_location == false) {
      temp[key] = currentSelectedPredefinedMarkers[key];
    }
  }

  for (let row = 0; row < nodes.length; row++) {
    setTimeout(() => {
      const node = nodes[row];

      changeColor(node.row, node.col, "path");

      if (row != node.length - 1) {
        if (temp[[node.row, node.col]] != undefined) {
          if (node.userDirection == "") {
            node.userDirection = "keep straight";
          }
          document.querySelector(
            `.node-${node.row}-${node.col}`
          ).innerHTML = `<div class="text">${node.userDirection}</div>`;
        }

        document.querySelector(
          `.node-${node.row}-${node.col}`
        ).innerHTML = `<div class="text">${node.userDirection}</div>`;
      }
    }, 1 * (row + listOfAllNodes.length));
  }
};
