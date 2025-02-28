let seed = Math.random();

function random() {
	const x = Math.sin(seed++) * 10_000;
	return x - Math.floor(x);
}

const up_angle = -Math.PI / 2;

// Represents the base node of the tree
export class Root {
	#child
	constructor(x, y, branchLength, depth) {
		this.x = x;
		this.y = y;
		this.branchLength = branchLength;
		this.depth = depth;

		if (this.depth === 0) return;

		this.#child = new Node(x, y - branchLength, branchLength, up_angle, depth);
	}

	get child() {
		return this.#child;
	}
}

// A class to represent a node in the l-system
class Node {
	#children

	constructor(x, y, branchLength, angle, depth) {
		this.x = x;
		this.y = y;
		this.branchLength = branchLength;
		this.angle = angle;
		this.depth = depth;
		this.#createChildren();
	}

	#createChildren() {
		if (this.depth === 0) return;

		// Set the children's depth
		const newDepth = this.depth - 1;

		// Calculate coord for new branch-end
		const endX = this.x + this.branchLength * Math.cos(this.angle);
		const endY = this.y + this.branchLength * Math.sin(this.angle);

		// Randomize branch splitting
		const splitAngle = (Math.PI / 4) * (0.5 + random()); // Random angle between 22.5 and 67.5 degrees
		const newLength = this.branchLength * (0.6 + 0.2 * random()); // Random length reduction

		// Set children to subbranches
		this.#children = {
			left: new Node(endX, endY, newLength, this.angle - splitAngle, newDepth),
			right: new Node(endX, endY, newLength, this.angle + splitAngle, newDepth)
		};
	}

	get children() {
		return this.#children;
	}
}
