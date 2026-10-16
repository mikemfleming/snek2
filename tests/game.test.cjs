const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function boot() {
  function element() {
    return {
      children: [], style: {}, classList: '', textContent: '', listeners: {},
      appendChild(child) { this.children.push(child); },
      replaceChildren() { this.children = []; },
      addEventListener(name, fn) { this.listeners[name] = fn; },
    };
  }
  const nodes = Object.fromEntries(['board', 'restart', 'status', 'score'].map(id => [id, element()]));
  const timers = [];
  const context = vm.createContext({
    document: { getElementById: id => nodes[id], createElement: element },
    setTimeout(fn) { timers.push(fn); },
  });
  for (const file of ['snake', 'state', 'init']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets', `${file}.js`), 'utf8'), context);
  }
  return { nodes, timers, run: code => vm.runInContext(code, context) };
}

test('board initializes, eating grows snake and applies bonus, death ends round, restart resets', () => {
  const game = boot();
  assert.equal(game.nodes.board.children.length, 20);
  assert.equal(game.nodes.board.children[0].children.length, 20);
  game.run("state.food = { x: 10, y: 9, type: 'bonus' }; state.step()");
  assert.equal(game.run('snake.spine.length'), 4);
  assert.equal(game.run('state.score'), 30);
  assert.equal(game.run('snake.spine.some(p => p.x === state.food.x && p.y === state.food.y)'), false);
  game.run('snake.spine = [{x:18,y:9},{x:19,y:9}]; state.step()');
  assert.equal(game.run('state.active'), false);
  assert.equal(game.run('state.score'), 30);
  game.nodes.restart.listeners.click();
  assert.equal(game.run('state.active'), true);
  assert.equal(game.run('state.score'), 0);
});

test('food can reach final row and column, and a full board ends safely', () => {
  const game = boot();
  game.run('snake.spine = []; for(let y=0;y<20;y++) for(let x=0;x<20;x++) if(x!==19 || y!==19) snake.spine.push({x,y})');
  assert.equal(game.run('state.nextFood().x === 19 && state.nextFood().y === 19'), true);
  game.run('snake.spine.push({x:19,y:19})');
  assert.equal(game.run('state.nextFood()'), null);
});

test('self collision detects the segment immediately behind the head', () => {
  const game = boot();
  game.run('snake.spine = [{x:8,y:9},{x:9,y:9},{x:8,y:9}]');
  assert.equal(game.run('state.detectCollision(snake.head())'), true);
});
