// An angle that points directly up
const UP = -Math.PI / 2;
// Used to define how branches with split left and right
const SPLIT_ANGLE = (Math.PI / 2) * (0.5);
// Amount branch length is reduced by for every tree level
const BRANCH_LENGTH_MOD = 0.6;

export class Tree {
	#root
	#renderer

	constructor(x, y, length, width, depth, taperPercent, renderer) {
		this.#root = new TreeNode(x, y, length, width, depth, UP, taperPercent);
		this.#renderer = renderer;
	}

	render() {
		this.#root.render(this.#renderer);
	}
}

class TreeNode {
	#x
	#y
	#length
	#width
	#leftChild
	#rightChild
	#taperPercent
	#angle

	constructor(x, y, length, width, depth, angle, taperPercent) {
		this.#x = x;
		this.#y = y;
		this.#length = length;
		this.#width = width;
		this.#taperPercent = taperPercent;
		this.#angle = angle;

		if (depth === 1) return;


		const newX = x + length * Math.cos(angle);
		const newY = y + length * Math.sin(angle);
		const newLength = length * BRANCH_LENGTH_MOD;
		const newWidth = width * taperPercent;
		const newDepth = depth - 1;
		// Creating children 

		this.#leftChild = new TreeNode(
			newX,
			newY,
			newLength,
			newWidth,
			newDepth,
			angle - SPLIT_ANGLE,
			taperPercent
		);

		this.#rightChild = new TreeNode(
			newX,
			newY,
			newLength,
			newWidth,
			newDepth,
			angle + SPLIT_ANGLE,
			taperPercent
		);
	}

	render(renderer) {
		renderer.drawTaperedLine(
			this.#x,
			this.#y,
			this.#x + this.#length * Math.cos(this.#angle),
			this.#y + this.#length * Math.sin(this.#angle),
			this.#width,
			this.#width * this.#taperPercent
		);

		if (this.#leftChild) {
			this.#leftChild.render(renderer);
			this.#rightChild.render(renderer);
		}
	}
}
