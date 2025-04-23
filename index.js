const prompt = require("prompt-sync")();

// Game elements
const GRASS = "░";
const HOLE = "O";
const HAT = "^";
const PLAYER = "*";

const rows = 8;
const cols = 5;

const field = [];                                           // Create an array for the game field

for (let i = 0; i < rows; i++){
    field[i] = [];
    for (let j = 0; j < cols; j++){                         // same as field = new Array();
        field[i][j] = Math.random() > 0.2 ? GRASS : HOLE;                                 // 8-% Grass, 20% Hole
    }
}

// add PLAYER to the start of the field
field [0][0] = PLAYER;



for (let row of field){
    console.log(row.join(""));
}