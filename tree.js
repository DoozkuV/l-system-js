const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// Random seed for reproducibility
let seed = Math.random();
let scale = 1; // Current zoom level
let offsetX = canvas.width / 2; // Initial X offset (centered)
let offsetY = canvas.height; // Initial Y offset (trunk at bottom)
let isPanning = false;
let startX = 0, startY = 0;

function random() {
	const x = Math.sin(seed++) * 10_000;
	return x - Math.floor(x);
}

function drawBranch(x, y, length, angle, depth) {
	if (depth === 0) return;

	// Calculate end point of each branch
	const endX = x + length * Math.cos(angle);
	const endY = y + length * Math.sin(angle);

	// Draw the branch
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(endX, endY);
	ctx.strokeStyle = `rgba(139, 69, 19, ${depth / 10})`; // Brown color for branches
	ctx.lineWidth = depth; // Thicker branches at lower depths
	ctx.stroke();

	// Randomize branch splitting
	const splitAngle = (Math.PI / 4) * (0.5 + random()); // Random angle between 22.5 and 67.5 degrees
	const newLength = length * (0.6 + 0.2 * random()); // random length reduction

	// Recursively draw sub-branches
	drawBranch(endX, endY, newLength, angle - splitAngle, depth - 1);
	drawBranch(endX, endY, newLength, angle + splitAngle, depth - 1);

	// Draw leaves at the end of branches
	if (depth === 1) {
		ctx.fillStyle = 'green';
		ctx.beginPath();
		ctx.arc(endX, endY, 5, 0, Math.PI * 2); // Small circle for leaves
		ctx.fill();

		// Add text inside the leaf
		ctx.fillStyle = 'white';
		ctx.font = '8px Arial';
		ctx.fillText('L', endX - 3, endY + 3); // Example text 
	}
}

function drawTree() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
	ctx.translate(offsetX, offsetY);
	ctx.scale(scale, scale); // Apply zoom

	const trunkLength = 100; // length of the trunk
	const trunkAngle = -Math.PI / 2; // Angle of the trunk (straight up)
	const initialDepth = 7; // Depth of recursion (number of branch levels)
	drawBranch(0, 0, trunkLength, trunkAngle, initialDepth);

	ctx.restore();
}

function getEventCoordinates(event, canvas) {
	return {
		x: event.clientX - canvas.getBoundingClientRect().left,
		y: event.clientY - canvas.getBoundingClientRect().top
	};
}
// Panning logic
canvas.addEventListener('mousedown', (e) => {
	isPanning = true;
	({ x: startX, y: startY } = getEventCoordinates(e, canvas));
});

canvas.addEventListener('mousemove', (e) => {
	if (!isPanning) return;

	const { x, y } = getEventCoordinates(e, canvas);

	const dx = x - startX;
	const dy = y - startY;

	offsetX += dx;
	offsetY += dy;

	startX = x;
	startY = y;
	drawTree();
});

const stopPanning = () => isPanning = false;
canvas.addEventListener('mouseup', stopPanning);
canvas.addEventListener('mouseout', stopPanning);

// Zoom logic
canvas.addEventListener('wheel', (e) => {
	e.preventDefault();

	const { mouseX, mouseY } = getEventCoordinates(e, canvas);

		const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out on scroll down
		const newScale = scale * zoomFactor;

		// Clamp scale to reasonable bounds
		if (newScale < 0.1 || newScale > 10) return;

		// calculate the virtual point under the mouse
		const virtualX = (mouseX - offsetX) / scale;
		const virtualY = (mouseY - offsetY) / scale;

		// Adjust offset to keep the point under the mouse stable
		offsetX = mouseX - virtualX * newScale;
		offsetY = mouseY - virtualY * newScale;

		scale = newScale;
		drawTree(); 
});

// Initial draw
drawTree(); 

