const ongoingTouches = [];
let vel = [0, 0];

export function startup() {
	window.addEventListener('touchstart', handleStart);
	window.addEventListener('touchend', handleEnd);
	window.addEventListener('touchcancel', handleEnd);
	window.addEventListener('touchmove', handleMove);
}

export function getVel() {
	return vel
};

function handleStart(evt) {
	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		ongoingTouches.push(copyTouch(touches[i]));
	}
}

function handleMove(evt) {
	const touches = evt.changedTouches;

	for (let i = 0; i < touches.length; i++) {
		const idx = ongoingTouchIndexById(touches[i].identifier);

		if (idx >= 0) {
			vel[0] = touches[i].pageX - ongoingTouches[idx].pageX;
			vel[1] = touches[i].pageY - ongoingTouches[idx].pageY;

			ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
		}
	}
}

function handleEnd(evt) {
	const touches = evt.changedTouches;

	vel = [0, 0];

	for (let i = 0; i < touches.length; i++) {
		let idx = ongoingTouchIndexById(touches[i].identifier);
		ongoingTouches.splice(idx, 1); // remove it; we're done
	}
}

function ongoingTouchIndexById(idToFind) {
	for (let i = 0; i < ongoingTouches.length; i++) {
		const id = ongoingTouches[i].identifier;

		if (id === idToFind) {
			return i;
		}
	}
	return -1; // not found
}


function copyTouch({
	identifier,
	pageX,
	pageY
}) {
	return {
		identifier,
		pageX,
		pageY
	};
}