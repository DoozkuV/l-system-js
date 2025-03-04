let seed = Math.random();

function random() {
	const x = Math.sin(seed++) * 10_000;
	return x - Math.floor(x);
}


const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

export function renderTree(root) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset

	ctx.strokeStyle = "#874313";
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.moveTo(root.x, root.y);

	const child = root.child;
	ctx.lineTo(child.x, child.y);
	ctx.stroke();

	renderBranches(child);

	ctx.restore();
}

function renderBranches(node) {
	if (!node.children) return;

	ctx.beginPath();
	Object.values(node.children).forEach(child => {
		ctx.lineWidth = 10 * (node.depth / 8);

		ctx.moveTo(node.x, node.y);
		ctx.lineTo(child.x, child.y);
	});
	ctx.stroke();

	Object.values(node.children).forEach(child => renderBranches(child));
}

