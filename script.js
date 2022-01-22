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
      this.id = 0;
    } else {
      this.speed = { x: 0, y: 0 };
      this.id = Math.random() * 100;
    }
  }

  pointsAreClose(point_2, canvas) {
    const distance = this.getDistance(point_2);
    let maxDistance = canvas;
    maxDistance < 100 ? 100 : maxDistance;
    return distance < maxDistance && distance > 0;
  }

  getDistance(point_2) {
    return Math.sqrt(Math.pow(this.x - point_2.x, 2) + Math.pow(this.y - point_2.y, 2));
  }
}

class Line {
  constructor(point_1, point_2, isMouseLine) {
    this.x1 = point_1.x;
    this.y1 = point_1.y;
    this.x2 = point_2.x;
    this.y2 = point_2.y;
    this.length = point_1.getDistance(point_2);
    this.isMouseLine = isMouseLine;
  }
}

function init() {
  initCanvas();
  createPoints(40);
  createLines();
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

function createLines() {
  linesToDraw = [];
  getMouseLines();
  points.forEach((p, i) => getLines(p, i, false));
}

function getMouseLines() {
  const currentMousepoint = hasMousePoint();
  if (currentMousepoint) {
    getLines(currentMousepoint, 0, true);
  }
}

function hasMousePoint() {
  return points.find((p) => p.id > 0);
}

function getLines(point, index, isMouseLine) {
  for (let i = 0; i < points.length; i++) {
    if (point.pointsAreClose(points[i], 0.2 * canvas.width) && points[i].id === 0 && i > index) {
      const line = new Line(point, points[i], isMouseLine);
      linesToDraw.push(line);
    }
  }
}

function containsLine(line) {
  return linesToDraw.find((l) => l.x1 === line.x2 && l.y1 === line.y2 && l.x2 === line.x1 && l.y2 === line.y1);
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
    ctx.strokeStyle = l.isMouseLine? getLineGradient(l) : getLineColor(l);
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();
    /* linesToDraw.splice(i, 1); */
  });
}

function getLineColor(l) {
  const alpha = getStrokeAlpha(l);
  return `hsla(165, 100%,10%, ${alpha})`;
}

function getLineGradient(l){
  const alpha = getStrokeAlpha(l);
  let gradient = ctx.createLinearGradient(l.x1, l.y1, l.x2, l.y2);
  gradient.addColorStop(0, `hsla(270, 100%, 50%, ${alpha}`);
  gradient.addColorStop(0.5, `hsla(217, 100%, 30%, ${alpha}`);
  gradient.addColorStop(1 ,`hsla(165, 100%,10%, ${alpha})`);
  return gradient;
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
  createLines();
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
      createLines();
    }, 500);
  }
}

function outOfView(p) {
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
document.documentElement.addEventListener('mouseleave', removeMousePoint);

function createMousePoint(event) {
  mousePoint = new Point(event.x, event.y, false);
  mouseId = mousePoint.id;
  points.push(mousePoint);
  createLines();
}

function moveMousePoint(event) {
  mousePoint.x = event.x;
  mousePoint.y = event.y;
  createLines();
}

function removeMousePoint() {
  const index = points.findIndex((p) => p.id > 0);
  points.splice(index, 1);
}
