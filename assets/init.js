const board = document.getElementById('board');
for (let y = 0; y < 20; y++) {
  const row = document.createElement('div');
  for (let x = 0; x < 20; x++) row.appendChild(document.createElement('div'));
  board.appendChild(row);
}

let snake = new Snake();// initialize game as soon as page loads
let food = { types: ['nega', 'turbo', 'normie', 'bonus', 'quake'] };
let state = new State();

// event listeners
document.getElementById('restart')
  .addEventListener('click', e => state.restart());

document.onkeydown = (e) => {
  const directions = {
    ArrowUp: 'north',
    ArrowRight: 'east',
    ArrowDown: 'south',
    ArrowLeft: 'west',
    w: 'north',
    d: 'east',
    s: 'south',
    a: 'west',
  };
  const momentum = {
    ArrowUp: 'south',
    ArrowRight: 'west',
    ArrowDown: 'north',
    ArrowLeft: 'east',
    w: 'south',
    d: 'west',
    s: 'north',
    a: 'east',
  };
  if (directions[e.key] || e.key === ' ') e.preventDefault();
  if (directions[e.key]) {
    if (snake.bearing !== momentum[e.key] && state.allowMove) {
      snake.bearing = directions[e.key];
      state.allowMove = false;
    }
  }
};

