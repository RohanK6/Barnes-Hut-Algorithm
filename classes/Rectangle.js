/**
 * A rectangle is defined by its center point (x, y) and its half-width and half-height
 * @param {number} x - x coordinate of the center point
 * @param {number} y - y coordinate of the center point
 * @param {number} w - width of the rectangle halved
 * @param {number} h - height of the rectangle halved
 * @see https://www.wikiwand.com/en/Quadtree#Prerequisites
 */
class Rectangle {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    /**
     * Get the left, right, top, and bottom corners of the rectangle
     * @returns {number[]} - an array of the left, right, top, and bottom corners of the rectangle
     */
    get corners() {
        const leftCorner = this.x - this.w / 2;
        const rightCorner = this.x + this.w / 2;
        const topCorner = this.y - this.h / 2;
        const bottomCorner = this.y + this.h / 2;
        return [leftCorner, rightCorner, topCorner, bottomCorner];
    }
  
    /**
     * 
     * @param {Point} point - a point to check if it is within the rectangle
     * @returns {boolean} - true if the point is within the rectangle, false otherwise
     */
    contains(point) {
        const [leftCorner, rightCorner, topCorner, bottomCorner] = this.corners;
        return (
            leftCorner <= point.x &&
            point.x <= rightCorner &&
            topCorner <= point.y &&
            point.y <= bottomCorner
        )
    }
  
    /**
     * Checks if the rectangle intersects with another rectangle
     * @param {Rectangle} range - the rectangle to check for intersection
     * @returns {boolean} - true if the rectangle intersects with the other rectangle, false otherwise
     */
    intersects(range) {
        const [leftCorner, rightCorner, topCorner, bottomCorner] = this.corners;
        return !(
            rightCorner < range.left ||
            range.right < leftCorner ||
            bottomCorner < range.top ||
            range.bottom < topCorner
        )
    }
  }