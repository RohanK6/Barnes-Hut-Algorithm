/**
 * @class Body - A class representing a body in space
 * @param {number} px - x coordinate of the body's position
 * @param {number} py - y coordinate of the body's position
 * @param {number} vx - x coordinate of the body's velocity
 * @param {number} vy - y coordinate of the body's velocity
 * @param {number} mass - the mass of the body
 */
class Body {
  constructor(px, py, vx, vy, m) {
    this.position = createVector(px, py);
    this.velocity = createVector(vx, vy);
    this.acceleration = createVector(0, 0);
    this.mass = m;
  }

  /**
	 * Applies a force to the body. This is calculated by dividing the force by the body's mass,
   * i.e. F = ma -> a = F / m. We then add the acceleration to the body's current acceleration.
	 * 
	 * @param {p5.Vector} force - the force to apply
	 */
  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  /**
	 * Calculates the applicable force on the body from another body.
   * Note: By the Barnes Hut approximation, the "true" force is
   * only calculated when the distance between the bodies is
   * less than a certain threshold. Otherwise, the force is
   * approximated by a single body at the center of mass of
   * the region of several bodies.
	 * 	
	 * @param {Body} otherBody - the body to apply the force towards
	 */
  calculateApplicableForce(otherBody) {
    let force = p5.Vector.sub(this.position, otherBody.position);
    let distanceSq = constrain(force.magSq(), 100, 1000);
    let strength = (GRAVIATIONAL_CONSTANT * (this.mass * otherBody.mass)) / distanceSq;
    force.setMag(strength);
    otherBody.applyForce(force);
  }

  /**
	 * Updates the body's position and velocity using Euler's method of numerical integration.
	 * 
	 * @returns {void}
	 * 
	 * @description
	 * Euler's method of numerical integration is a simple approximation method that estimates the value 
	 * of a function at the next time step based on its current value and derivative. In this method, 
	 * the velocity of the body is updated using the current acceleration, and the position is updated 
	 * using the current velocity. The method sets the acceleration to zero after updating the velocity 
	 * to avoid cumulative error in the position updates. Finally, the velocity is clamped to a maximum 
	 * value of 10 to prevent it from growing uncontrollably. 
	 */
  integrateByEulersMethod() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.velocity.limit(10);
    this.acceleration.set(0, 0);
  }

  /**
   * Displays the body as a point
   */
  visualize() {
    noStroke();
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
