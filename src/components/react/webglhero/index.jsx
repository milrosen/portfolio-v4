import React, { useRef, useEffect } from "react";
import { setup } from "./webgl.js"

export default function WebglHero() {
	const canvasRef = useRef();
	const frame = document.getElementById("frame")

	useEffect(() => {
		var gl = canvasRef.current.getContext("webgl2", { antialias: false });

		const mountWebgl = async () => {
			const render = await setup(gl);
			requestAnimationFrame(render);
		}
		mountWebgl();

		const performanceCorrection = 1.6;

		const handleResize = e => {
			const { width, height } = frame.getBoundingClientRect();

			gl.canvas.height = height * window.devicePixelRatio / performanceCorrection - 1;
			gl.canvas.width = width * window.devicePixelRatio / performanceCorrection;

			canvasRef.current.style.height = (gl.canvas.height * performanceCorrection / window.devicePixelRatio) + 'px';
			canvasRef.current.style.width = (gl.canvas.width * performanceCorrection / window.devicePixelRatio) + 'px';
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<canvas ref={canvasRef}>
			Your browser does not support the HTML canvas tag.
		</canvas>
	);
}
