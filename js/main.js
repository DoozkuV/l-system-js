import { Root } from "./l-system.js";
import { renderTree } from "./canvas-renderer.js";

// Prepare UI elements 
const canvas = document.getElementById('treeCanvas');
const renderButton = document.getElementById("renderButton");
const depthSlider = document.getElementById("depthSlider");
const depthValue = document.getElementById("depthValue");

// Initialize the tree
let depth = 8;
const trunkLength = 100;
const rootX = canvas.width / 2; // Middle of the canvas
const rootY = canvas.height; // Bottom of the canvas

// Function for rendering the tree
const createNewTree = () => {
	const root = new Root(rootX, rootY, trunkLength, depth);
	renderTree(root);
}
// Render the tree on load and on button
window.addEventListener("load", createNewTree);
renderButton.addEventListener("click", createNewTree);
canvas.addEventListener("click", createNewTree);

depthSlider.addEventListener("input", () => {
	depth = parseInt(depthSlider.value);
	depthValue.textContent = depth;
});
