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

const solveTheGrid = (grid, initializedPosition, map_of_markers) => {
  const [shortPathList, listOfAllNodes, solvedGrid] = dijkstraAlgo(
    grid,
    initializedPosition
  );
  let tempNodes = [];
  for (let i = 0; i < shortPathList.length; i++) {
    let [row, col] = shortPathList[i];
    tempNodes.push({
      key: i + 1,
      row: row,
      col: col,
      direction: null,
      userDirection: "",
      latitude: null,
      longitude: null,
      image: null,
      locationName: null,
    });
  }
  let sortedNodes = tempNodes.sort((a, b) => a.key - b.key);
  let nodes = getDirections(sortedNodes);
  nodes = nodes.sort((a, b) => a.key - b.key);
  let last_node = nodes[nodes.length - 1];
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

  for (let row = 0; row < nodes.length; row++) {
    const node = nodes[row];
    if (row != node.length - 1) {
      if (map_of_markers[[node.row, node.col]] != undefined) {
        if (node.userDirection == "") {
          node.userDirection = "keep straight";
        }
        node.latitude = map_of_markers[[node.row, node.col]].latitude;
        node.longitude = map_of_markers[[node.row, node.col]].longitude;
        node.image = map_of_markers[[node.row, node.col]].image;
      }
    }
  }
  return nodes;
};

export { solveTheGrid };
