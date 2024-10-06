import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function earthOrbit(time) {

}


function createOrbitEat() {
	const shape = new THREE.Shape();


	const a = 1;
	const e = 0.016708;
	const b = a * Math.sqrt(1 - e*e);
	const c = e*a;

	let u = [];
	for (var i = -Math.PI ; i < Math.PI; i+=0.0001)	u.push();

	let x = [];
	for (var i = 0; i < u.length; i++) {
		x.push(a * Math.cos(u[i]) - e);
	}

	let y = [];
	for (var i = 0; i < u.length; i++) {
		y.push(a * Math.sqrt(1-e^2) * Math.sin(u[i]));
	}


	for(var i = 0; i < u.length; i++) {
		shape.bezierCurveTo(x[i], y[i]);
	}

	const geometry = new THREE.ShapeGeometry( shape, 3 );

	const orbitMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true,
		opacity: 0.5
	});
	const orbit = new THREE.Mesh(geometry, orbitMaterial);

	orbit.rotation.x = Math.PI / 2;
	return orbit;
}


export default createOrbitEat;