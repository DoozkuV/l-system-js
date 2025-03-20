const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

const UP = -Math.PI / 2;
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
}

/*
 * A single node on a tree. Represents a position on the leftmost part of the branch
 */
class TreeNode {
	#x
	#y
	#leftBranch
	#rightBranch

	/**
	 * Creates a TreeNode.
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

		if (depth === 1) return;

		// Create children
		const splitAngle = (Math.PI / 4) * (0.5);
		const topWidth = width * taperPercent;

		const newY = y + length * Math.sin(angle);
		const newX = x + 0.5 * width * Math.cos(angle);
		const newLength = length * 0.6;
		const newWidth = width * 0.5;
		const newDepth = depth - 1;

		this.#leftBranch = new TreeNode(
			newX * (1 - taperPercent), // Leftmost side 
			newY,
			newLength,
			newWidth,
			newDepth,
			angle - splitAngle,
			taperPercent
		);

		this.#rightBranch = new TreeNode(
			newX,
			newY,
			newLength,
			newWidth,
			newDepth,
			angle + splitAngle,
			taperPercent
		);


	}
}
