#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform mat3 cam_basis;

    // we need to declare an output for the fragment shader
out vec4 outColor;

float rand(vec2 c) {
	return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

//Try to tweak this values
const float epsilon = 0.003;
float fov = radians(35.);
const float view_radius = 1.5;
const int mandelbulb_iter_num = 6;
const float camera_distance = 1.2;

float mandelbulb_sdf(vec3 pos) {
	float power = 8. + cos(iTime * .3);
	vec3 z = pos;
	float dr = 1.0;
	float r = 0.0;
	for(int i = 0; i < mandelbulb_iter_num; i++) {
		r = length(z);
		if(r > 3.)
			break;

		// convert to polar coordinates
		float theta = acos(z.z / r);
		float phi = atan(z.y, z.x);

		dr = pow(r, power - 1.0) * power * dr + 1.0;

		// scale and rotate the point
		float zr = pow(r, power);
		theta = theta * power;
		phi = phi * power;

		// convert back to cartesian coordinates
		z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
		z += pos;
	}
	return 0.5 * log(r) * r / dr;
}

float scene_sdf(vec3 p) {
	return mandelbulb_sdf(p);
}

void ray_marching(const vec3 eye, const vec3 ray, out float depth, out float steps) {
	depth = 0.;
	steps = 0.;
	float dist;
	vec3 intersection_point;

	do {
		intersection_point = eye + depth * ray;
		dist = scene_sdf(intersection_point);
		depth += dist;
		steps++;
	} while(depth < view_radius && dist > epsilon);
}

vec2 transformed_coordinates(vec2 frag_coord) {
	vec2 coord = (frag_coord / iResolution.xy) * 2. - 1.;
	coord.y *= iResolution.y / iResolution.x;
	return coord;
}

float contrast(float val, float contrast_offset, float contrast_mid_level) {
	return clamp((val - contrast_mid_level) * (1. + contrast_offset) + contrast_mid_level, 0., 1.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

	vec2 coord = transformed_coordinates(fragCoord);

	vec3 ray = normalize(vec3(coord * tan(fov), 1));
	ray = cam_basis * ray;

	vec3 cam_pos = -cam_basis[2] * camera_distance + cam_basis * vec3(.5, .75, 0);

	float depth = 0.;
	float steps = 0.;

	ray_marching(cam_pos + epsilon * ray, ray, depth, steps);

	//AO
	float ao = steps * 0.01;
	ao = 1. - ao / (ao + 0.5);  // reinhard

	const float contrast_offset = 0.9;
	const float contrast_mid_level = 0.6;
	ao = contrast(ao, contrast_offset, contrast_mid_level);

	float val = 1. - ao;

	val = val - rand(fragCoord) * .4;

	val = clamp(val / length(coord + vec2(.5, .5)) - .01, 0., 1.);

	float low = ceil(val) * .1;
	float mid = ceil(val - .4) * .15;
	float high = ceil(val - .8) * .1;

	val = low + mid + high;
	fragColor = vec4(0, 0, 0, val);
}

void main() {
	mainImage(outColor, gl_FragCoord.xy);
}