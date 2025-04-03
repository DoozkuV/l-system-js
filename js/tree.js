import { Renderer } from "./renderer.js";

// An angle that points directly up
const UP = -Math.PI / 2;
// Used to define how branches with split left and right
const SPLIT_ANGLE = (Math.PI / 2) * (0.5);
// Amount branch length is reduced by for every tree level
const BRANCH_LENGTH_MOD = 0.6;
const LEAF_COLOR = '#6da76d';
const TEXT_COLOR = '#000';

export class Tree {
	#root
	color

	constructor(x, y, length, width, depth, taperPercent, color) {
		this.#root = new TreeNode(x, y, length, width, depth, UP, taperPercent);
		this.color = color;
	}

	/**
	 * @param {Renderer} r 
	 */
	render(r) {
		r.ctx.strokeStyle = this.color;
		r.ctx.fillStyle = this.color;
		this.#root.render(r);
	}

	/**
	* Creates a leaf at the next valid spot on the tree if possible. If not, returns null
	* @param {string} text 
	* @returns {Leaf|null}
	*/
	createLeaf(text) {
		const leafNode = this.#root.getValidLeaf();
		if (!leafNode) return null;

		leafNode.hasLeaf = true;
		return new Leaf(
			leafNode.endX,
			leafNode.endY,
			leafNode.angle,
			text,
			leafNode
		);
	}
}

class TreeNode {
	#length
	#width
	#leftChild
	#rightChild
	#taperPercent

	constructor(x, y, length, width, depth, angle, taperPercent) {
		this.x = x;
		this.y = y;
		this.hasLeaf = false;
		this.#length = length;
		this.#width = width;
		this.#taperPercent = taperPercent;
		this.angle = angle;

		if (depth === 1) return;


		const endX = this.endX;
		const endY = this.endY;
		const newLength = length * BRANCH_LENGTH_MOD;
		const newWidth = width * taperPercent;
		const newDepth = depth - 1;
		// Creating children 

		this.#leftChild = new TreeNode(
			endX,
			endY,
			newLength,
			newWidth,
			newDepth,
			angle - SPLIT_ANGLE,
			taperPercent
		);

		this.#rightChild = new TreeNode(
			endX,
			endY,
			newLength,
			newWidth,
			newDepth,
			angle + SPLIT_ANGLE,
			taperPercent
		);
	}

	get endX() {
		return this.x + this.#length * Math.cos(this.angle);
	}
	get endY() {
		return this.y + this.#length * Math.sin(this.angle);
	}

	getValidLeaf() {
		if (!this.#leftChild && !this.hasLeaf) {
			return this;
		}

		if (this.#leftChild) {
			return this.#leftChild.getValidLeaf() ||
				this.#rightChild.getValidLeaf();
		}

		return false;
	}

	/**
	 * @param {Renderer} r 
	 */
	render(r) {
		r.drawTaperedLine(
			this.x,
			this.y,
			this.x + this.#length * Math.cos(this.angle),
			this.y + this.#length * Math.sin(this.angle),
			this.#width,
			this.#width * this.#taperPercent
		);

		if (this.#leftChild) {
			this.#leftChild.render(r);
			this.#rightChild.render(r);
		}
	}
}

class Leaf {
	#x;
	#y;
	#angle;
	#text;
	#node;

	/**
	 * Create a new leaf
	 * @param {number} x 
	 * @param {number} y
	 * @param {number} angle
	 * @param {string} text 
	 * @param {TreeNode} node
	 */
	constructor(x, y, angle, text, node) {
		this.#x = x;
		this.#y = y;
		this.#angle = angle;
		this.#text = text;
		this.#node = node;
	}

	/**
	* @param {Renderer} r 
	*/
	render(r) {
		r.ctx.fillStyle = LEAF_COLOR;
		r.ctx.font = '16px Arial';  // Increased font size
		r.drawLeaf(this.#x, this.#y, this.#angle, TEXT_COLOR, this.#text);
	}
}
