import { Tree } from "./tree.js"
import { Renderer } from "./renderer.js";

const canvas = document.getElementById('treeCanvas');
const container = document.getElementById('canvas-container');

const renderer = new Renderer(canvas);

const DEFAULT_LENGTH = 1000 * 3;
const DEFAULT_WIDTH = 400 * 3;
const DEFAULT_DEPTH = 7;
const DEFAULT_TAPER_PERCENT = 0.50;
const TREE_COLOR = "#962D00"
let tree;

// Set up canvas 
function resizeCanvas() {
	const dpr = window.devicePixelRatio || 1;
	const rect = container.getBoundingClientRect();

	// Set actual pixel dimensions 
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;

	// Set CSS display dimensions
	canvas.style.width = rect.width + 'px';
	canvas.style.height = rect.height + 'px';

	if (renderer.targets && renderer.targets.length !== 0) {
		renderer.render();
	}
}

// Mouse/touch event handling 
function getEventPosition(e) {
	const rect = canvas.getBoundingClientRect();
	const clientX = e.clientX || (e.touches && e.touches[0].clientX);
	const clientY = e.clientY || (e.touches && e.touches[0].clientY);
	return {
		x: (clientX - rect.left) * (canvas.width / rect.width),
		y: (clientY - rect.top) * (canvas.height / rect.height)
	};
}

function handleMouseDown(e) {
	const pos = getEventPosition(e);
	renderer.transform.lastX = pos.x;
	renderer.transform.lastY = pos.y;
	renderer.transform.isDragging = true;
	canvas.style.cursor = 'grabbing';
}

function handleMouseMove(e) {
	if (!renderer.transform.isDragging) return;

	const pos = getEventPosition(e);
	const dx = pos.x - renderer.transform.lastX;
	const dy = pos.y - renderer.transform.lastY;

	renderer.transform.offsetX += dx;
	renderer.transform.offsetY += dy;
	renderer.transform.lastX = pos.x;
	renderer.transform.lastY = pos.y;

	renderer.render();
}

function handleMouseUp() {
	renderer.transform.isDragging = false;
	canvas.style.cursor = 'grab';
}

function handleWheel(e) {
	e.preventDefault();

	const pos = getEventPosition(e);
	const zoom = e.deltaY < 0 ? 1.1 : 0.9;

	// Calculate point under mouse in world space before zoom 
	const mouseX = (pos.x - renderer.transform.offsetX) / renderer.transform.scale;
	const mouseY = (pos.y - renderer.transform.offsetY) / renderer.transform.scale;

	// Apply zoom
	renderer.transform.scale *= zoom;

	// Limit zoom levels 
	renderer.transform.scale = Math.min(Math.max(0.1, renderer.transform.scale), 10);

	// Adjust offset to keep point under mouse fixed 
	renderer.transform.offsetX = pos.x - mouseX * renderer.transform.scale;
	renderer.transform.offsetY = pos.y - mouseY * renderer.transform.scale;

	renderer.render();
}

function setupControls() {
	const depthSlider = document.getElementById('depthSlider');
	const depthValue = document.getElementById('depthValue');
	const renderButton = document.getElementById('renderButton');

	depthSlider.addEventListener('input', () => {
		depthValue.textContent = depthSlider.value;
	});

	renderButton.addEventListener('click', () => {
		const depth = parseInt(depthSlider.value);
		const x = canvas.width / (2 * window.devicePixelRatio);
		const y = canvas.height / window.devicePixelRatio;
		tree = new Tree(x, y, DEFAULT_LENGTH, DEFAULT_WIDTH, depth, DEFAULT_TAPER_PERCENT, TREE_COLOR);

		renderer.flushTargets();
		renderer.addTarget(tree);
		renderer.render();
	});
}

window.addEventListener("load", () => {
	// Initial resizing of canvas
	resizeCanvas();

	const x = canvas.width / (2 * window.devicePixelRatio);
	const y = canvas.height / window.devicePixelRatio;

	// Set up event listeners for zoom and pan 
	canvas.addEventListener('mousedown', handleMouseDown);
	canvas.addEventListener('mousemove', handleMouseMove);
	canvas.addEventListener('mouseup', handleMouseUp);
	canvas.addEventListener('mouseleave', handleMouseUp);
	canvas.addEventListener('wheel', handleWheel);

	// Touch events 
	canvas.addEventListener('touchstart', handleMouseDown);
	canvas.addEventListener('touchmove', handleMouseMove);
	canvas.addEventListener('touchend', handleMouseUp);

	canvas.style.cursor = 'grab';

	setupControls();

	// Create the tree 
	tree = new Tree(
		x, y,
		DEFAULT_LENGTH,
		DEFAULT_WIDTH,
		DEFAULT_DEPTH,
		DEFAULT_TAPER_PERCENT,
		TREE_COLOR
	);
	renderer.addTarget(tree);
	let i = 1;
	while (true) {
		const leaf = tree.createLeaf(`Leaf ${i}`);
		if (leaf) renderer.addTarget(leaf); else break;
		++i;
	}

	// Initial render 
	renderer.render();
});

window.addEventListener('resize', resizeCanvas);
