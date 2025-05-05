import promptSync from "prompt-sync";

let prompt = new promptSync();

// Constants for the game
const WIN = "Congratulations. You found the hat!";
const LOSE = "You lost.";
const OUT_BOUND = "You are out of the field";
const INTO_HOLE = "You fell into a hole";
const WELCOME = "Welcome to Find Your Hat Game";
const DIRECTION = "(u)p, (d)own, (l)eft, (r)ight?";
const QUIT = "Press q or Q to quit.";
const END_GAME = "Game Ended. Thank you for playing.";
const NOT_RECOGNISED = "Input not recognised.";

// Constants for game elements
const HAT = "^";
const HOLE = "0";
const GRASS = "░";
const PLAYER = "*";

class Field {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.field = new Array([]);
    this.gamePlay = false;
    this.playerPos = { row: 0, col: 0 };
  }

  static welcomeMessage(msg) {
    console.log(
      "\n****************************\n" +
        msg +
        "\n****************************\n"
    );
  }

  generateField() {
    for (let i = 0; i < this.rows; i++) {
      this.field[i] = new Array();
      for (let j = 0; j < this.cols; j++) {
        this.field[i][j] = GRASS;
      }
    }

    // Place hat randomly (not at 0,0)
    let hatPlaced = false;
    while (!hatPlaced) {
      const hatRow = Math.floor(Math.random() * this.rows);
      const hatCol = Math.floor(Math.random() * this.cols);
      if (hatRow !== 0 || hatCol !== 0) {
        this.field[hatRow][hatCol] = HAT;
        hatPlaced = true;
      }
    }

    // Place a few holes
    const holesToPlace = Math.floor((this.rows * this.cols) * 0.2);
    let placed = 0;
    while (placed < holesToPlace) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      if (this.field[r][c] === GRASS && (r !== 0 || c !== 0)) {
        this.field[r][c] = HOLE;
        placed++;
      }
    }
  }

  printField() {
    this.field.forEach((row) => console.log(row.join("")));
  }

  endGame() {
    console.log(END_GAME);
    this.gamePlay = false;
    process.exit();
  }

  updatePlayer(position) {
    // Calculate new position
    let newRow = this.playerPos.row;
    let newCol = this.playerPos.col;

    if (position === "u") newRow--;
    if (position === "d") newRow++;
    if (position === "l") newCol--;
    if (position === "r") newCol++;

    // Check for out-of-bounds
    if (
      newRow < 0 ||
      newRow >= this.rows ||
      newCol < 0 ||
      newCol >= this.cols
    ) {
      console.log(OUT_BOUND);
      console.log(LOSE);
      this.endGame();
      return;
    }

    const cell = this.field[newRow][newCol];

    if (cell === HOLE) {
      console.log(INTO_HOLE);
      console.log(LOSE);
      this.endGame();
      return;
    }

    if (cell === HAT) {
      console.log(WIN);
      this.endGame();
      return;
    }

    // Clear previous position
    this.field[this.playerPos.row][this.playerPos.col] = GRASS;

    // Update to new position
    this.playerPos = { row: newRow, col: newCol };
    this.field[newRow][newCol] = PLAYER;
  }

  updateGame() {
    let userInput = "";
    do {
      console.log(DIRECTION.concat(" ", QUIT));
      userInput = prompt();
      switch (userInput.toLowerCase()) {
        case "u":
        case "d":
        case "l":
        case "r":
          this.updatePlayer(userInput.toLowerCase());
          break;
        case "q":
          this.endGame();
          break;
        default:
          console.log(NOT_RECOGNISED);
          break;
      }

      this.printField();
    } while (userInput.toLowerCase() !== "q");
  }

  startGame() {
    this.gamePlay = true;
    this.generateField();
    this.field[0][0] = PLAYER;
    this.playerPos = { row: 0, col: 0 };
    this.printField();
    this.updateGame();
  }
}

Field.welcomeMessage(WELCOME);
const ROWS = 5;
const COLS = 5;
const gameField = new Field(ROWS, COLS);
gameField.startGame();
