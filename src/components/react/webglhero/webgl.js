import {
	startup,
	getVel
} from './handletouches.js'

class Vector {
	x;
	y;
	z;

	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	normalize = () => {
		let len = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
		this.x = this.x / len;
		this.y = this.y / len;
		this.z = this.z / len;

		return this;
	}
	mult = (num) => {
		return new Vector(this.x * num, this.y * num, this.z * num);
	}
	add = (vec) => {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
	};
	subtract = (vec) => {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
	};
	dot = (vec) => {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	};
	cross = (b) => {
		// a X b = C(a)b where C(a) =
		// 0 -az ay
		// az 0 -ax
		// -ay ax 0
		return new Vector(0 + -this.z * b.y + this.y * b.z,
			this.z * b.x + 0 + -this.x * b.z,
			-this.y * b.x + this.x * b.y + 0);
	};
	transform = (M) => {
		return new Vector(M[0] * this.x + M[3] * this.y + M[6] * this.z,
			M[1] * this.x + M[4] * this.y + M[7] * this.z,
			M[2] * this.x + M[5] * this.y + M[8] * this.z, );
	}
}

async function setup(gl) {

	const fragmentShaderSource = await (await fetch('/portfolio-v4/fragment.glsl')).text();
	const vertexShaderSource = await (await fetch('/portfolio-v4/vertex.glsl')).text();

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	const program = createProgram(gl, vertexShader, fragmentShader);

	// look up where the vertex data needs to go.
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	// look up uniform locations
	const resolutionLocation = gl.getUniformLocation(program, "iResolution");
	const timeLocation = gl.getUniformLocation(program, "iTime");
	const cameraBasisLocation = gl.getUniformLocation(program, "cam_basis");

	const vao = gl.createVertexArray();

	// and make it the one we're currently working with
	gl.bindVertexArray(vao);

	// Create a buffer to put three 2d clip space points in
	const positionBuffer = gl.createBuffer();

	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// fill it with a 2 triangles that cover clip space
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		-1, -1, // first triangle
		1, -1,
		-1, 1,
		-1, 1, // second triangle
		1, -1,
		1, 1,
	]), gl.STATIC_DRAW);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionAttributeLocation);

	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	gl.vertexAttribPointer(
		positionAttributeLocation,
		2, // 2 components per iteration
		gl.FLOAT, // the data is 32bit floats
		false, // don't normalize the data
		0, // 0 = move forward size * sizeof(type) each iteration to get the next position
		0, // start at the beginning of the buffer
	);

	// MOVING THE CAMERA

	let prevtime = 0;
	let facing = new Vector(1 / 2, Math.sqrt(3) / 2, 1); // normalized vector tanget to sphere
	let location = new Vector(Math.sqrt(3) / 2, -1 / 2, 0); // normalized vector on unit 
	let orth = location.cross(facing).normalize(); // right vector;
	let velocity = [0, .5];
	const scaling = .001;
	const touchScaling = .01;
	const damping = .98;

	window.addEventListener('wheel', e => {
		velocity[0] += e.deltaX * scaling;
		velocity[1] -= e.deltaY * scaling;
	})

	startup();

	return function render(time) {
		if (isNaN(time)) time = 0;
		time *= 0.001; // convert to seconds

		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);

		// Bind the attribute/buffer set we want.
		gl.bindVertexArray(vao);

		let deltTime = time - prevtime;

		const touchVelocity = getVel() || [0, 0];

		velocity[0] -= touchVelocity[0] * touchScaling;
		velocity[1] += touchVelocity[1] * touchScaling;

		velocity[0] *= damping;
		velocity[1] *= damping;

		// add velocity in x direction, then find new right vector
		location.add(orth.mult(velocity[0] * deltTime));
		orth = location.cross(facing).normalize();
		// add velocity in y direction, then find new facing vector
		location.add(facing.mult((velocity[1] + .1) * deltTime));
		facing = orth.cross(location).normalize();
		location.normalize()

		// camBasis.x = orth, camBasis.y = location, camBasis.z = facing;
		let camBasis = [orth.x, orth.y, orth.z,
			location.x, location.y, location.z,
			facing.x, facing.y, facing.z
		]

		// send matrix to webgl.
		gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform1f(timeLocation, time);
		gl.uniformMatrix3fv(cameraBasisLocation, false, camBasis);

		gl.drawArrays(
			gl.TRIANGLES,
			0, // offset
			6, // num vertices to process
		);

		prevtime = time;
		requestAnimationFrame(render);
	}
}


function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}


export {
	setup,
};