/**
 * @class Point
 * @param {number} x - x coordinate of the point
 * @param {number} y - y coordinate of the point
 * @param {any} self - the self reference of the point
 * @see https://www.wikiwand.com/en/Quadtree#Prerequisites
 */
class Point {
  constructor(x, y, self) {
    this.x = x;
    this.y = y;
    this.self = self;
  }
}