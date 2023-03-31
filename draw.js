let bodies = [];

/* CONSTANTS */
const N_BODIES = 350;
const CAPACITY = 1;
const GRAVIATIONAL_CONSTANT = 0.3;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
let SHOW_QUAD_TREE = true;

/**
 * Sets up the canvas and creates the bodies.
 */
function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const HALF_PI = PI / 2;

  for (let i = 0; i < N_BODIES; i++) {
    let position = p5.Vector.random2D();
    let velocity = position.copy();
    position.setMag(random(150, 200));
    velocity.setMag(random(10, 15));
    velocity.rotate(HALF_PI);
    const mass = random(10, 15);
    bodies[i] = new Body(position.x, position.y, velocity.x, velocity.y, mass);
  }
  background(0);
}

/**
 * Draws the bodies and the quad tree. 
 */ 
function draw() {
  clear();
  background(0);
  const boundary = new Rectangle(0, 0, width, height);
  const quadTree = new QuadTree(boundary, CAPACITY);

  for (const body of bodies) {
    const point = new Point(body.position.x, body.position.y, body);
    quadTree.insert(point);
  }

  for (const body of bodies) {
    calculateApplicableForce(body, quadTree);
  }

  push();
  translate(width / 2, height / 2);

  for (const body of bodies) {
    body.integrateByEulersMethod();
    body.visualize();
  }

  show(quadTree);
  pop();

  document.getElementById("time").innerHTML = "Time: " + millis();
  document.getElementById("bodies").innerHTML = "Bodies: " + bodies.length;
  document.getElementById("fps").innerHTML = "FPS: " + frameRate();
}

/**
 * Calculates the applicable force on a body from a quad tree. Since this is the Barnes Hut approximation,
 * the force is only calculated when the distance between the body and the quad tree's center of mass is
 * less than a certain threshold. Otherwise, the force is approximated by a single body at the center of
 * mass of the region of several bodies.
 * @param {Body} body - the body to calculate the force on
 * @param {QuadTree} quadTree - the quad tree to calculate the force from
 */
function calculateApplicableForce(body, quadTree) {
  let distance = dist(body.position.x, body.position.y, quadTree.boundary.x, quadTree.boundary.y);
  if (distance < 25) {
    for (const point of quadTree.points) {
			if (body != point.self) {
				point.self.calculateApplicableForce(body);
			}
		}
  } else {
    const numOfPoints = quadTree.points.length;
		if (numOfPoints > 0) {
			const temporaryBody = new Body(quadTree.boundary.x, quadTree.boundary.y, 0, 0, body.mass * numOfPoints);
			temporaryBody.calculateApplicableForce(body);
		}
  }

  if (quadTree.isDivided) {
    calculateApplicableForce(body, quadTree.northEast);
    calculateApplicableForce(body, quadTree.northWest);
    calculateApplicableForce(body, quadTree.southEast);
    calculateApplicableForce(body, quadTree.southWest);
  }
}

/**
 * Draws the quad tree.
 * @param {QuadTree} quadTree - the quad tree to draw
 */ 
function show(quadTree) {
  if (!SHOW_QUAD_TREE) return;

  stroke(255);
  noFill();
  strokeWeight(0.25);
  rectMode(CENTER);
  rect(
    quadTree.boundary.x,
    quadTree.boundary.y,
    quadTree.boundary.w,
    quadTree.boundary.h
  );

  if (quadTree.isDivided) {
    show(quadTree.northEast);
    show(quadTree.northWest);
    show(quadTree.southEast);
    show(quadTree.southWest);
  }
}

function stop() {
  noLoop();
}

function start() {
  loop();
}

function toggleTree() {
  SHOW_QUAD_TREE = !SHOW_QUAD_TREE;
}
