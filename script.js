document.addEventListener('DOMContentLoaded', init);

let canvas;
let ctx;
let points = [];
let linesToDraw = [];
let mousePoint = {};

class Point {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    if (speed) {
      this.speed = { x: -0.5 + Math.random() * 1, y: -0.5 + Math.random() * 1 };
    } else {
      this.speed = 0;
      this.id = Math.random() * 10000;
    }
  }
}

function init() {
  initCanvas();
  createPoints(40);
  getLines();
  draw();
}

function initCanvas() {
  canvas = document.getElementById('canvas');
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;
  ctx = canvas.getContext('2d');
}

function createPoints(count) {
  for (let i = 0; i < count; i++) {
    const point = new Point(getX(), getY(), true);
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
      const dist = getDistance(p, points[i]);
      if (pointsAreClose(dist)) {
        const line = {
          x1: p.x,
          y1: p.y,
          x2: points[i].x,
          y2: points[i].y,
          length: dist,
        };
        if (!containsLine(line)) linesToDraw.push(line);
      }
    }
  });
}

function getDistance(point_1, point_2) {
  return Math.sqrt(Math.pow(point_1.x - point_2.x, 2) + Math.pow(point_1.y - point_2.y, 2));
}

function pointsAreClose(distance) {
  maxDistance = 0.2 * canvas.width;
  maxDistance < 100 ? 100 : maxDistance;
  return distance < maxDistance && distance > 0;
}

function containsLine(line) {
  return linesToDraw.find((l) => l == line);
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPoints();
  drawLines();
  animate();
}

function drawPoints() {
  points.forEach((p) => {
    ctx.fillStyle = 'hsl(165, 100%, 15%)';
    ctx.beginPath();
    ctx.arc(p.x - 0.6, p.y - 0.6, 1.2, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawLines() {
  linesToDraw.forEach((l, i) => {
    const alpha = getStrokeAlpha(l);
    ctx.beginPath();
    ctx.strokeStyle = `hsla(165, 100%, 10%, ${alpha})`;
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
    linesToDraw.splice(i, 1);
  });
}

function getStrokeAlpha(l) {
  let alpha;
  if (l.length <= 0.1 * canvas.width) {
    return 1;
  } else {
    let ratio = -(0.1 * canvas.width - l.length) / (0.1 * canvas.width);
    alpha = 1 - ratio;
    return alpha;
  }
}

function animate() {
  movePoints();
  getLines();
}

function movePoints() {
  points.forEach((p, i) => {
    p.x = p.x + p.speed.x;
    p.y = p.y + p.speed.y;
    checkPointPosition(p, i);
  });
}

function checkPointPosition(point, index) {
  if (outOfView(point)) {
    points.splice(index, 1);
    setTimeout(() => {
      createPoints(1);
      getLines();
    }, 500);
  }
}

function outOfView(p) {
  /* console.log(p.x < -0.1 * canvas.width || p.x > canvas.width + 0.1 * canvas.width || p.y < -0.1 * canvas.width || p.y > canvas.hight + 0.1 * canvas.width) */
  return (
    p.x < -0.1 * canvas.width ||
    p.x > canvas.width + 0.1 * canvas.width ||
    p.y < -0.1 * canvas.width ||
    p.y > canvas.hight + 0.1 * canvas.width
  );
}

window.addEventListener('resize', initCanvas);

/* -----------  MOUSE ANIMATION  ------------- */

document.documentElement.addEventListener('mouseenter', createMousePoint);
document.documentElement.addEventListener('mousemove', moveMousePoint);

let mouseId;

function createMousePoint(event) {
  mousePoint = new Point(event.x, event.y, false);
  mouseId = mousePoint.id;
  points.push(mousePoint);
  console.log(mousePoint);
  console.log(points);
  getLines();
}

function moveMousePoint(event) {
  console.log(event);
  mousePoint.x = event.x;
  mousePoint.y = event.y;
  getLines();
}
