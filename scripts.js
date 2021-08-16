//Define vars
var newBlockNeeded = true;
var nextBlock;
var curBlock;
var setBlocks;
var rotatedShape;
var cells = Array(...document.querySelectorAll(".grid-container .cell"));
var scoreCell = document.getElementById("score");
var score = 0;
var play = true;

//Define tetris blocks
//Block I
const iBlock = {
  color: 'blue',
  shape: [
    {x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:3, y:0}
  ]
}
//Block J
const jBlock = {
  color: 'dblue',
  shape: [
    {x:0, y:1}, {x:0, y:0}, {x:1, y:0}, {x:2, y:0}
  ]
}
//Block L
const lBlock = {
  color: 'orange',
  shape: [
    {x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:2, y:1}
  ]
}
//Block O
const oBlock = {
  color: 'yellow',
  shape: [
    {x:0, y:0}, {x:0, y:1}, {x:1, y:0}, {x:1, y:1}
  ]
}
//Block S
const sBlock = {
  color: 'green',
  shape: [
    {x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:1}
  ]
}
//Block t
const tBlock = {
  color: 'purple',
  shape: [
    {x:0, y:0}, {x:1, y:0}, {x:1, y:1}, {x:2, y:0}
  ]
}
//Block z
const zBlock = {
  color: 'red',
  shape: [
    {x:0, y:1}, {x:1, y:1}, {x:1, y:0}, {x:2, y:0}
  ]
}

blocks = [iBlock, jBlock, lBlock, oBlock, sBlock, tBlock, zBlock]

//recursively called function to repeatedly trigger movement
function clock() {
  setTimeout(function main() {
    //if new block needed.
    if (newBlockNeeded) {
      //if next block not null copy it to current block, else random block
      if (nextBlock) {
        curBlock = JSON.parse(JSON.stringify(nextBlock));
      } else {
        curBlock = JSON.parse(JSON.stringify(blocks[Math.floor(Math.random() * blocks.length)]));
      }
      newBlockNeeded = false;
      setNewBlock();
      clearNextBox();
      nextBlock = blocks[Math.floor(Math.random() * blocks.length)];
      paintNextBox();
    }
    move(0, -1);
    if (play) {
      clock();
    }
  }, 500)
}
clock(); //Original Clock call

//Shift coordinates of curBlock to the top of the grid
function setNewBlock() {
  disp = Math.floor(Math.random() * 6)
  var shape = curBlock.shape;
  for(i = 0; i < 4; i++) {
    shape[i].x = shape[i].x + disp; 
    shape[i].y = shape[i].y + 20;
  }
}

function move(dX, dY) {
  if (newBlockNeeded || !play) 
    return;
  var c = curBlock.color;
  var shape = curBlock.shape;
  for(i = 0; i < 4; i++) {
    //Only look at the cells that are in the front of the movement
    let frontCell = true;
    for(j = 0; j < 4; j++) {
      if (shape[i].x + dX == shape[j].x && shape[i].y + dY == shape[j].y) {
        frontCell = false;
      }
    }
    if (!frontCell) {
      continue;
    }

    let loc = shape[i];
    //copying primitive values instead of pointers
    let y = loc.y; 
    let x = loc.x;
    //Checks if at grid edge
    if ( (y == 0 && dY == -1) || (x == 9 && dX == 1) || (x == 0 && dX == -1)) {
      if (dY == -1) {
        clearLevels();
        newBlockNeeded = true;
      }
      return;
    }
    //Checks if hit another block
    y = y + dY;
    x = x + dX;
    if (y <= 19) {
      cell = document.querySelector(`.grid-container div[data-loc="x${x}y${y}"]`);
      if (cell.classList != "cell") {
        if (dY == -1) {
          //Check if any cells are outside the grid
          for (i = 0; i < 4; i ++) {
            if (shape[i].y >= 20) {
              endGame();
              return;
            }
          }
          clearLevels();
          newBlockNeeded = true;
        }
        return;
      }
    }
  }

  //clear out existing cells
  for(i = 0; i < 4; i++) {
    let loc = shape[i];
    if (loc.y <= 19) {
      cell = document.querySelector(`.grid-container div[data-loc="x${loc.x}y${loc.y}"]`);
      cell.className = "cell";
    }
  }

  //Coloring in shifted cells
  for(i = 0; i < 4; i++) {
    let loc = shape[i];
    loc.x = loc.x + dX;
    loc.y = loc.y + dY;
    if (loc.y <= 19) {
      downCell = document.querySelector(
        `.grid-container div[data-loc="x${loc.x}y${loc.y}"]`);
      downCell.className = `cell ${c}`;
    }
  }
}

function paintNextBox() {
  var c = nextBlock.color;
  var shape = nextBlock.shape;
  for (i = 0; i < 4; i++) {
    let loc = shape[i]
    let cell = document.querySelector(`.next-box div[data-loc="x${loc.x}y${loc.y}"]`);
    cell.classList.add(c);
  }
}

function clearNextBox() {
  //Clearing out color classes from cells in Next Box
  document.querySelector('.next-box div[data-loc="x0y0"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x1y0"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x2y0"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x3y0"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x0y1"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x1y1"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x2y1"]').className = "cell";
  document.querySelector('.next-box div[data-loc="x3y1"]').className = "cell";
}

document.onkeydown = function(e) { 
  switch(e.key) {
    case "ArrowUp":
      rotate();
      break;
    case "ArrowLeft":
      move(-1, 0);
      break;
    case "ArrowRight":
      move(1, 0);
      break;
    case "ArrowDown":
      move(0, -1);
      break;
  }
};

function rotate() {
  let c = curBlock.color;
  let shape = curBlock.shape;
  //Squares can't rotate
  if (c == "yellow") {
    return;
  }
  let origin = shape[2]; //Setting origin
  rotatedShape = shape.map(function(e) {
    return {
      x: e.y - origin.y + origin.x,
      y: -e.x + origin.x + origin.y
    };
  });

  for(i = 0; i < 4; i++) {
    //Only look at the cells that aren't rotating onto themselves
    let onSelfCell = false;
    for(j = 0; j < 4; j++) {
      if (rotatedShape[i].x == shape[j].x && rotatedShape[i].y == shape[j].y) {
        onSelfCell = true;
      }
    }
    if (onSelfCell) {
      continue;
    }

    //Checks if at grid edge
    if (rotatedShape[i].y < 0 || rotatedShape[i].x < 0 || rotatedShape[i].x > 9) {
      return;
    }

    //Checks if hit another block
    let loc = rotatedShape[i];
    if (loc.y <= 19) {
      cell = document.querySelector(`.grid-container div[data-loc="x${loc.x}y${loc.y}"]`);
      if (cell.classList != "cell") {
        return;
      }
    }
  }

  //clear out existing cells
  for(i = 0; i < 4; i++) {
    let loc = shape[i];
    if (loc.y <= 19) {
      cell = document.querySelector(`.grid-container div[data-loc="x${loc.x}y${loc.y}"]`);
      cell.className = "cell";
    }
  }

  for(i = 0; i < 4; i++) {
    shape[i].x = rotatedShape[i].x;
    shape[i].y = rotatedShape[i].y;
  }

  //Coloring in shifted cells
  for(i = 0; i < 4; i++) {
    let loc = rotatedShape[i];
    if (loc.y <= 19) {
      downCell = document.querySelector(
        `.grid-container div[data-loc="x${loc.x}y${loc.y}"]`);
      downCell.className = `cell ${c}`;
    }
  }
};

function clearLevels() {
  let cellClasses = cells.map(c => {
    return c.className;
  });
  for (i = 0; i < 20; i++) {
    let rowFull = true;
    for (j = 0; j < 10; j++) {
      if (cellClasses[i * 10 + j] == "cell") {
        rowFull = false;
      }
    }
    if (rowFull) {
      score = score + 10;
      scoreCell.innerHTML = score;
      cellClasses.splice(i * 10, 10);
      cellClasses.unshift("cell", "cell", "cell", "cell", "cell",
       "cell", "cell", "cell", "cell", "cell");
    }
  }
  for (i = 0; i < 200; i++) {
    cells[i].className = cellClasses[i];
  }
}

function endGame() {
  alert("Score: " + score);
  play = false;
  newBlockNeeded = false;
}