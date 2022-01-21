document.addEventListener('DOMContentLoaded', init);

let canvas;
let ctx;
let points = [];
let linesToDraw = [];

class Point {
  constructor(x, y) {
    this.id = Math.floor(Math.random() * 10);
    this.x = x;
    this.y = y;
  }
}

function init() {
  initCanvas();
  createPoints();
}

function initCanvas() {
  canvas = document.getElementById('canvas');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  ctx = canvas.getContext('2d');
}

function createPoints() {
  for (let i = 0; i < 10; i++) {
    const point = new Point(getX(), getY());
    points.push(point);
  }
}

function getX() {
  return Math.random() * canvas.width;
}

function getY() {
  return Math.random() * canvas.height;
}
