class Snake {
  constructor() {
    this.bearing = 'east'; // snake begins in consistent position and bearing
    this.spine = [{ x: 7, y: 9 },
                  { x: 8, y: 9 },
                  { x: 9, y: 9 }];
    this.trail = { x: 6, y: 9 };
  }
  head() {
    return this.spine[this.spine.length - 1]; // returns head location
  }
  move() {
    // creates a new head
    let { x, y } = this.head(); // gets old head x, y
    if (this.bearing === 'north') y--; // updates new x, y values
    if (this.bearing === 'east') ++x;
    if (this.bearing === 'south') y++;
    if (this.bearing === 'west') x--;

    this.spine.push({ x, y }); // adds new head
    this.trail = this.spine.shift(); // sets vertebrae to repaint
  }
  grow() {
    const { x, y } = this.spine[0]; // creates new tail
    this.spine.unshift({ x, y }); // adds it to the end of the snake
  }
}
