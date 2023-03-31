/**
 * A quadtree is a tree data structure in which each internal node has exactly four children.
 * @param {Rectangle} boundary - the boundary of the quadtree
 * @param {number} capacity - the maximum number of points that can be stored in a quadtree
 * @param {number} level - the level of the quadtree before it is subdivided into four children
 * @see https://www.wikiwand.com/en/Quadtree
 */
class QuadTree {
  constructor(boundary, capacity, level = 0) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.isDivided = false;
    this.level = level;
  }

  /**
    * Subdivides the quadtree into four children
	*/
  subdivide() {
	const x = this.boundary.x;
	const y = this.boundary.y;
	const w = this.boundary.w;
	const h = this.boundary.h;

	const northEastRectangle = new Rectangle(x+w/4, y-h/4, w/2, h/2);
	const northWestRectangle = new Rectangle(x-w/4, y-h/4, w/2, h/2);
	const southEastRectangle = new Rectangle(x+w/4,y+h/4, w/2, h/2);
	const southWestRectangle = new Rectangle(x-w/4, y+h/4, w/2, h/2);

	this.northEast = new QuadTree(northEastRectangle, this.capacity, this.level+1);
	this.northWest = new QuadTree(northWestRectangle, this.capacity, this.level+1);
	this.southEast = new QuadTree(southEastRectangle, this.capacity, this.level+1);
	this.southWest = new QuadTree(southWestRectangle, this.capacity, this.level+1);

	this.isDivided = true;

    for (const point of this.points) {
      this.northEast.insert(point);
      this.northWest.insert(point);
      this.southEast.insert(point);
      this.southWest.insert(point);
    }

    this.points = [];
  }

  /**
	 * Inserts a point into the quadtree
	 * @param {Point} point - the point to insert
	 * @returns {boolean} - true if the point was inserted, false otherwise
	 */
  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.isDivided) {
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }

      this.subdivide();
    }

    this.northEast.insert(point);
    this.northWest.insert(point);
    this.southEast.insert(point);
    this.southWest.insert(point);
  }

  	/**
	 * Queries the quadtree for points within a given range
	 * @param {Rectangle} range - the range to query for
	 * @returns {Point[]} - an array of points within the range
	 * */
	query(range) {
		const pointsWithinQueryRange = [];

		if (!this.boundary.intersects(range)) {
			return pointsWithinQueryRange;
		} else {
			for (const point of this.points) {
				if (range.contains(point)) {
					pointsWithinQueryRange.push(point);
				}
			}
		}

		if (this.isDivided) {
			pointsWithinQueryRange.push(...this.northEast.query(range));
			pointsWithinQueryRange.push(...this.northWest.query(range));
			pointsWithinQueryRange.push(...this.southEast.query(range));
			pointsWithinQueryRange.push(...this.southWest.query(range));
		}

		return pointsWithinQueryRange;
	}
}