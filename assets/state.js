class State {
  constructor() {
    document.getElementById('restart').style.visibility = 'hidden'; // only show when game is inactive
    document.getElementById('status').textContent = 'Arrow keys or WASD to move.';
    this.active = true; // used for restart display
    this.allowMove = true; // used for movement logic
    this.score = 0; // resets to 0 whenever new State() is called
    this.scoreDiv = document.getElementById('score');
    this.scoreDiv.textContent = 0; // reset view

    this.boardDiv = document.getElementById('board'); // grab grid
    this.board = Array.from(this.boardDiv.children) // create 2d array matrix
      .map(c => Array.from(c.children));

    this.food = this.nextFood(); // make new food
    this.time = 250; // can be changed by turbo food
    this.bonus = 1; // also ^
    this.snakeStyle = 'snake'; // can be changed be nega food
    this.quakeTime = 250; // starts at 250, increases 500ms each time eaten

    // modularizes a 'stepping' fn
    this.interval = (fn, period) => { 
      return setTimeout(fn.bind(this), period);
    }; // interval can be used by any function o times

    this.resetFx(); 
    this.clearBoard(); // clears last game
    this.interval(this.step, this.time); // starts steppin
    this.paint();
  }

  //////////////////////
  // GAME STATE LOGIC //
  //////////////////////
  applyFx(type) {

    const fx = { // object makes it easy to access fx fn's
      turbo: () => this.time = 100, // steps faster
      nega: () => this.snakeStyle = 'negaStyle', // makes snake glow
      normie: () => this.resetFx(), // resets all active fx - bummer!
      bonus: () => { // adds a bonus multiplier to food
        this.bonus = 3; // multiplier
        this.scoreDiv.classList = 'bonus-points'; // makes score red
      },
      quake: () => { 
        this.boardDiv.classList = 'earthquake'; // connects board to css quake animation class
        setTimeout(() => this.boardDiv.classList = '', this.quakeTime); // removes it after amt of time
        this.quakeTime += 500; // increases how long before it lasts
      },
    };
    fx[type](); // call fx here
  }

  resetFx() { // resets all relevant state to default
    this.time = 250; 
    this.snakeStyle = 'snake';
    this.bonus = 1;
    this.scoreDiv.classList = '';
    this.boardDiv.classList = '';
  }

  paint() {
    
    // paint snake
    const oldSnake = snake.trail; // erase the previous tail before painting the current snake
    this.board[oldSnake.y][oldSnake.x].classList = '';
    for (let [_, vert] of snake.spine.entries()) { // note to self: for of loops are slow
      const { x, y } = vert; // get x, y from all snake vertebrae
      this.board[y][x].classList = this.snakeStyle; // apply current snakeStyle to each element
    }
    
    if (!this.food) return;
    // paint food
    this.board[this.food.y][this.food.x].classList = this.food.type; // each pellet has a different color
  }

  step() { // this is where the action of the game lives

    snake.move(); // snake moves 1 pace per step
    let { x, y } = snake.head(); // reference x, y of current head
    if (x === this.food.x && y === this.food.y) { // check if need to eat
      this.feed();
    }

    // if snake hits wall or collides with itself, end the game
    if (this.hitWall({ x, y }) || this.detectCollision({ x, y }) || !this.food) {
      document.getElementById('status').textContent = this.food ? 'Game over. Re-Snek to try again.' : 'You filled the board!';
      this.active = false;
      document.getElementById('restart').style.visibility = 'visible';
        return; // end if snake hit wall or bit itself
    }

    // else, the game continues
    this.paint(); // paint all the movement we just did
    this.interval(this.step, this.time); // game continues
    this.allowMove = true; // resets for user input
  }

  feed() {
    this.applyFx(this.food.type); // activate fx
    snake.grow(); // add length to snake
    this.updateScore();
    this.food = this.nextFood();
  }

  nextFood() {
    const free = [];
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (!snake.spine.some(tile => tile.x === x && tile.y === y)) free.push({ x, y });
      }
    }
    if (!free.length) return null;
    return { ...free[Math.floor(Math.random() * free.length)], type: food.types[Math.floor(Math.random() * food.types.length)] };
  }

  detectCollision(tile) { // returns true or false
    return snake.spine  // is the tile on the snake
      .slice(0, -1) // anywhere below it's head
      .find(v => v.x === tile.x && v.y === tile.y)
      !== undefined;
  }

  hitWall(tile) { // returns true or false
    return tile.x < 0 || tile.x > 19 || tile.y < 0 || tile.y > 19;
  }

  ///////////////////////////
  // DISPLAY AND WEB LOGIC //
  ///////////////////////////

  clearBoard() { // removes style from board
    this.board.forEach((row) => {
      row.forEach((cell) => {
        cell.classList = '';
      });
    });
  }

  restart() {
    if (this.active) return; // can't restart during active game
    snake = new Snake(); // reinitialize all state

    state = new State();
  }

  updateScore() {
    this.score = this.score + (this.bonus * 10); // adds bonus modifier
    this.scoreDiv.textContent = this.score;
  }

}
