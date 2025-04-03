export class Renderer {
	transform = {
		scale: 1,
		offsetX: 0,
		offsetY: 0,
		lastX: 0,
		lastY: 0,
		isDragging: false
	}

	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	setStyle() {
		this.ctx.fillStyle = "#962D00"
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	applyTransform() {
		this.ctx.setTransform(
			this.transform.scale, 0,
			0, this.transform.scale,
			this.transform.offsetX, this.transform.offsetY
		);
	}

	resetTransform() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	drawTaperedLine(x1, y1, x2, y2, startWidth, endWidth) {

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


		const ctx = this.ctx;
		// Draw the tapered shape
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.lineTo(p3.x, p3.y);
		ctx.lineTo(p4.x, p4.y);
		ctx.closePath();
		ctx.fill();
	}
}
