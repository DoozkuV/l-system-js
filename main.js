import { Root } from "./l-system.js";
import { renderTree } from "./canvas-renderer.js";

const canvas = document.getElementById('treeCanvas');

const trunkLength = 100;
const depth = 8;
const rootX = canvas.width / 2; // Middle of the canvas
const rootY = canvas.height; // Bottom of the canvas
let root = new Root(rootX, rootY, trunkLength, depth);

renderTree(root);

const renderButton = document.getElementById("renderButton");

renderButton.addEventListener("click", () => {
		let root = new Root(rootX, rootY, trunkLength, depth);
		
		renderTree(root);
});
