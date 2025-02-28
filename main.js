import { Root } from "./l-system.js";
import { renderTree } from "./canvas-renderer.js";

const canvas = document.getElementById('treeCanvas');
const renderButton = document.getElementById("renderButton");
const depthSlider = document.getElementById("depthSlider");
const depthValue = document.getElementById("depthValue");

const trunkLength = 100;
let depth = 8;
const rootX = canvas.width / 2; // Middle of the canvas
const rootY = canvas.height; // Bottom of the canvas
const root = new Root(rootX, rootY, trunkLength, depth);

renderTree(root);

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
