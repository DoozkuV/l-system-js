const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

export function drawTaperedLine(x1, y1, x2, y2, startWidth, endWidth) {
	// Calculate the angle of the line
	const angle = Math.atan2(y2 - y1, x2 - x1);
	const halfPi = Math.PI / 2;

	// Calculate points for the tapered shape
	const p1 = {
		x: x1 + Math.cos(angle + halfPi) * startWidth / 2,
		y: y1 + Math.sin(angle + halfPi) * startWidth / 2
	};
	const p2 = {
		x: x1 + Math.cos(angle - halfPi) * startWidth / 2,
		y: y1 + Math.sin(angle - halfPi) * startWidth / 2
	};
	const p3 = {
		x: x2 + Math.cos(angle - halfPi) * endWidth / 2,
		y: y2 + Math.sin(angle - halfPi) * endWidth / 2
	};
	const p4 = {
		x: x2 + Math.cos(angle + halfPi) * endWidth / 2,
		y: y2 + Math.sin(angle + halfPi) * endWidth / 2
	};

	// Draw the tapered shape
	ctx.beginPath();
	ctx.moveTo(p1.x, p1.y);
	ctx.lineTo(p2.x, p2.y);
	ctx.lineTo(p3.x, p3.y);
	ctx.lineTo(p4.x, p4.y);
	ctx.closePath();
	ctx.fill();
}

