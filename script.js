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
  getLines();
  draw();
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

function getLines() {
  points.forEach((p) => {
    for (let i = 0; i < points.length; i++) {
      if (pointsAreClose(p, points[i])) {
        const line = {
          x1: p.x,
          y1: p.y,
          x2: points[i].x,
          y2: points[i].y,
        };
        if (!containsLine(line)) linesToDraw.push(line);
      }
    }
  });
}

function pointsAreClose(point_1, point_2) {
  const distance = Math.sqrt(Math.pow(point_1.x - point_2.x, 2) + Math.pow(point_1.y - point_2.y, 2))
  return distance < 0.2 * canvas.width && distance > 0;
}

function containsLine(line) {
  return linesToDraw.find((l) => l == line);
}

function draw() {
  linesToDraw.forEach((l, i) => {
    ctx.beginPath();
    ctx.strokeStyle = `hsl(165, 100%, 10%)`;
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
  });
}