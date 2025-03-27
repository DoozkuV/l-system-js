// An angle that points directly up
const UP = -Math.PI / 2;
// Used to define how branches with split left and right
const SPLIT_ANGLE = (Math.PI / 4) * (0.5);
// Amount branch length is reduced by for every tree level
const BRANCH_LENGTH_MOD = 0.6;

/**
 * Represents a whole tree. Position of this tree is at the base of the trunk 
 */
export class Tree {
	#rootNode

	/**
	 * Creates a Tree instance.
	 * @param {number} x - The x-coordinate of the center of the tree's base.
	 * @param {number} y - The y-coordinate of the base of the tree.
	 * @param {number} length - The length of the trunk.
	 * @param {number} width - The width of the trunk.
	 * @param {number} depth - The depth of the tree (number of recursive branches).
	 * @param {number} taperPercent - The percentage by which branches taper as they grow.
	 */
	constructor(x, y, length, width, depth, taperPercent) {
		// Center the tree horizontally
		x -= length / 2;
		this.#rootNode = new TreeNode(x, y, length, width, depth, UP, taperPercent);
	}

	// Calls callback on each child
	walk(callback) {
		this.#rootNode.walk(callback);
	}

	// Draws tree from root node
	draw(ctx) {
		this.#rootNode.draw(ctx);
	}
}

/*
 * A single node on a tree. Represents a position on the leftmost part of the branch
 */
class TreeNode {
	#x
	#y
	#length
	#width
	#leftChild
	#rightChild
	#taperPercent
	#angle

	/**
	 * Creates a TreeNode. A node is created on the bottom-leftmost part of a branch. 
	 * This tree node will recursively make children until the depth reaches 1. 
	 * @param {number} x - The x-coordinate of the node.
	 * @param {number} y - The y-coordinate of the node.
	 * @param {number} length - The length of the branch.
	 * @param {number} width - The width of the branch.
	 * @param {number} depth - The depth of the tree (number of recursive branches).
	 * @param {number} angle - The angle of the branch in radians.
	 * @param {number} taperPercent - The percentage by which the branch tapers.
	 */
	constructor(x, y, length, width, depth, angle, taperPercent) {
		this.#x = x;
		this.#y = y;
		this.#length = length;
		this.#width = width;
		this.#taperPercent = taperPercent;
		this.#angle = angle;


		if (depth === 1) return;

		// CREATING CHILDREN 
		// This generates the X position of the center of the tree .
		// This is where the rightmost branch will be placed.
		const newX = x + 0.5 * width * Math.cos(angle);
		const newY = y + length * Math.sin(angle);

		const newLength = length * BRANCH_LENGTH_MOD;
		const newWidth = width * 0.5;
		const newDepth = depth - 1;

		this.#leftChild = new TreeNode(
			newX * (1 - taperPercent), // Math to get the leftmost branch
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

	/**
	 * Traverses the tree structure in a pre-order manner, calling the provided callback
	 * for each node visited.
	 * 
	 * @param {Function} callback - A function that will be called with the x and y coordinates
	 *                              of each node in the tree. The callback receives two parameters:
	 *                              the x-coordinate and the y-coordinate of the node.
	 * @returns {void}
	 */
	walk(callback) {
		callback(this.#x, this.#y);
		if (!this.#leftChild) return;

		this.#leftChild.walk(callback);
		this.#rightChild.walk(callback);

	}

	/**
	* Draws this node and all of it's children on the canvas
	*/
	draw(ctx) {

		const angle = this.#angle;
		const length = this.#length;
		const width = this.#width;

		// Calculate endpoints for left and right sides of the branch
		const leftEndX = this.#x + length * Math.cos(angle);
		const leftEndY = this.#y + length * Math.sin(angle);

		// Right start is perpendicular to the angle
		const rightStartX = this.#x + width * Math.cos(angle + Math.PI / 2);
		const rightStartY = this.#y + width * Math.sin(angle + Math.PI / 2);
		const rightEndX = rightStartX + length * Math.cos(angle);
		const rightEndY = rightStartY + length * Math.sin(angle);

		// Draw left side
		ctx.beginPath();
		ctx.moveTo(this.#x, this.#y);
		ctx.lineTo(leftEndX, leftEndY);

		// Draw right side 
		ctx.moveTo(rightStartX, rightStartY);
		ctx.lineTo(rightEndX, rightEndY);

		ctx.stroke();

		// Draw children if they exist
		if (this.#leftChild) {
			this.#leftChild.draw(ctx);
			this.#rightChild.draw(ctx);
		}
	}
}
