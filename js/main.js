import { Root } from "./l-system.js";
import { renderTree } from "./canvas-renderer.js";

const canvas = document.getElementById('treeCanvas');

// Initialize the tree
let depth = 8;
const trunkLength = 100;
const rootX = canvas.width / 2; // Middle of the canvas
const rootY = canvas.height; // Bottom of the canvas
const root = new Root(rootX, rootY, trunkLength, depth);


window.addEventListener("load", () => renderTree(root));

// UI element functionality
const renderButton = document.getElementById("renderButton");
const depthSlider = document.getElementById("depthSlider");
const depthValue = document.getElementById("depthValue");

const reRenderTree = () => {
	const root = new Root(rootX, rootY, trunkLength, depth);
	renderTree(root);
}
renderButton.addEventListener("click", reRenderTree);
canvas.addEventListener("click", reRenderTree);

depthSlider.addEventListener("input", () => {
	depth = parseInt(depthSlider.value);
	depthValue.textContent = depth;
});
