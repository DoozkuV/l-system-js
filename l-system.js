// A class to represent a node in the l-system
class Node {
	constructor(x, y, length, angle, depth) {
		this.x = x;
		this.y = y;
		this.children = this.generateChildren();
	}

	generateChildren() {
		if (this.depth === 0) return;

		// Set the children's depth
		const newDepth = depth - 1;

		// Calculate coord for new branch-end
		const endX = x + length * Math.cos(angle);
		const endY = y + length * Math.sin(angle);

		// Randomize branch splitting
		const splitAngle = (Math.PI / 4) * (0.5 + random()); // Random angle between 22.5 and 67.5 degrees
		const newLength = length * (0.6 + 0.2 * random()); // Random length reduction

		// Recursively draw sub-branches

		calcPoint(endX, endY, newLength, angle - splitAngle, newDepth);
		calcPoint(endX, endY, newLength, angle + splitAngle, newDepth);

	}
}

let seed = Math.random();

function random() {
	const x = Math.sin(seed++) * 10_000;
	return x - Math.floor(x);
}

function calcPoint(x, y, length, angle, depth) {



}
