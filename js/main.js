import { Tree } from "./tree.js"

const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext("2d");
const container = document.getElementById('canvas-container');

let tree;

// Set up canvas 

const resizeCanvas = () => {
	const dpr = window.devicePixelRatio || 1;
	const rect = container.getBoundingClientRect();

	// Set actual pixel dimensions 
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;

	// Set CSS display dimensions
	canvas.style.width = rect.width + 'px';
	canvas.style.height = rect.height + 'px';

	ctx.scale(dpr, dpr); // Scale context for sharp rendering 

	if (tree) {
		renderTree();
	}
}

const renderTree = () => {
	// Clear canvas before redrawing 
	ctx.clearRect(0, 0, canvas.width, canvas.height);


	tree.walk((x, y) => console.log(`coords: ${x}, ${y}`));
	tree.draw(ctx);
	//tree.walk((x, y) => ctx.fillRect(x, y, 10, 10));
}


window.addEventListener("load", () => {
	// Initial resizing of canvas
	resizeCanvas();

	const x = canvas.width / (2 * window.devicePixelRatio);
	const y = canvas.height / window.devicePixelRatio;
	tree = new Tree(x, y, 100, 50, 7, 0.25);

	renderTree();

});

window.addEventListener('resize', resizeCanvas);
