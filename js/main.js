import { Root } from "./l-system.js";
import { renderTree } from "./canvas-renderer.js";

const canvas = document.getElementById('treeCanvas');

// Initialize the tree
let depth = 8;
const trunkLength = 100;
const rootX = canvas.width / 2; // Middle of the canvas
const rootY = canvas.height; // Bottom of the canvas
const root = new Root(rootX, rootY, trunkLength, depth);

// Load the tree when ready 
window.addEventListener("load", () => renderTree(root));

// UI FUNCTIONALITY
const renderButton = document.getElementById("renderButton");
const depthSlider = document.getElementById("depthSlider");
const depthValue = document.getElementById("depthValue");

const createNewTree = () => {
	const root = new Root(rootX, rootY, trunkLength, depth);
	renderTree(root);
}
renderButton.addEventListener("click", createNewTree);
canvas.addEventListener("click", createNewTree);

depthSlider.addEventListener("input", () => {
	depth = parseInt(depthSlider.value);
	depthValue.textContent = depth;
});
