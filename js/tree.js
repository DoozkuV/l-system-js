const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

const UP = -Math.PI / 2;
// Amount branch length is reduced by for every tree level
const BRANCH_LENGTH_MOD = 0.6;
export class Tree {
	#rootNode
	constructor(x, y, length, width, depth, taperPercent) {
		// Nodes are on the left of a branch, "tree" is the middle of the trunk
		x -= length / 2;
		this.#rootNode = new TreeNode(x, y, length, width, depth, UP, taperPercent);
	}
}

// A node is actually positioned at the bottom left corner of a branch
class TreeNode {
	#x
	#y
	#leftBranch
	#rightBranch

	constructor(x, y, length, width, depth, angle, taperPercent) {
		this.#x = x;
		this.#y = y;


		if (depth == 0) return;

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
