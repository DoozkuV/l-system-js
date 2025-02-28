let seed = Math.random();

function random() {
	const x = Math.sin(seed++) * 10_000;
	return x - Math.floor(x);
}

// A class to represent a node in the l-system
class Node {
	#children

	constructor(x, y, length, angle, depth) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.angle = angle;
		this.depth = depth;
		this.#createChildren();
	}

	#createChildren() {
		if (this.depth === 0) return;

		// Set the children's depth
		const newDepth = depth - 1;

		// Calculate coord for new branch-end
		const endX = x + this.length * Math.cos(angle);
		const endY = y + this.length * Math.sin(angle);

		// Randomize branch splitting
		const splitAngle = (Math.PI / 4) * (0.5 + random()); // Random angle between 22.5 and 67.5 degrees
		const newLength = this.length * (0.6 + 0.2 * random()); // Random length reduction

		// Set children to subbranches
		this.#children = {
			left: new Node(endX, endY, newLength, angle - splitAngle, newDepth),
			right: new Node(endX, endY, newLength, angle + splitAngle, newDepth)
		};
	}

	hasChildren() {
		return this.#children !== undefined;
	}

	get children() {
		return this.#children;
	}
}
