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
		// Targets to be rendered 
		// Each contain a "render" function that takes a 
		// Renderer as the only parameter
		this.targets = [];
	}

	addTarget(obj) {
		this.targets.push(obj);
	}

	flushTargets() {
		this.targets = [];
	}

	render() {
		this.resetTransform();
		this.clear();
		this.applyTransform();
		this.targets.forEach((o) => {
			this.ctx.save();
			o.render(this);
			this.ctx.restore();
		});
	}

	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	applyTransform() {
		const transform = this.transform;
		this.ctx.setTransform(
			transform.scale, 0,
			0, transform.scale,
			transform.offsetX,
			transform.offsetY
		);
	}

	screenToWorld(x, y) {
		return {
			x: (x - this.transform.offsetX) / this.transform.scale,
			y: (y - this.transform.offsetY) / this.transform.scale
		};
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

	drawLeaf(x, y, angle, textColor, text) {
		const ctx = this.ctx;
		const width = 120 * 3
		const height = 80 * 3;

		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(angle);

		// Draw leaf shape
		ctx.beginPath();
		ctx.moveTo(0, height / 2);

		// Left curve
		ctx.quadraticCurveTo(
			-width / 2 - 20, 0,
			0, -height / 2
		);

		// Right curve 
		ctx.quadraticCurveTo(
			width / 2 + 20, 0,
			0, height / 2
		);

		ctx.closePath();
		ctx.fill();
		ctx.restore();

		ctx.translate(x, y);

		ctx.fillStyle = textColor;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		// Reset rotation for text (keep translation)
		// Draw the text now 
		ctx.fillText(text, 0, 0);
	}
}
