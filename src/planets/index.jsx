import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useEffect, useRef, useState } from "react";
import getStarfield from "./starfield.js";
import TWEEN from '@tweenjs/tween.js'; // Добавляем для плавной анимации

function Planetarium() {
	const refContainer = useRef(null);
	const [selectedPlanet, setSelectedPlanet] = useState(null); // Для хранения выбранной планеты

	useEffect(() => {
		const w = window.innerWidth;
		const h = window.innerHeight;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
		camera.position.z = 30;
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(w, h);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

		let time = 0;

		const controls = new OrbitControls(camera, renderer.domElement);
		const planets = [];
		const loader = new THREE.TextureLoader();
		const detail = 12;

		const orbits = {
			Earth: { radius: 15, speed: 1 },
			Mars: { radius: 20, speed: 0.5 },
			Jupiter: { radius: 28, speed: 0.2 }
		};

		const textures = {
			sun: "./textures/2k_sun.jpg",
			earth: "./textures/00_earthmap1k.jpg",
			mars: "./textures/2k_mars.jpg",
			jupiter: "./textures/2k_jupiter.jpg",
		};

		function createPlanetGroup({ name, position, textures, size = 1 }) {
			const group = new THREE.Group();
			group.position.set(position.x, position.y, position.z);

			const geometry = new THREE.IcosahedronGeometry(size, detail);
			const material = new THREE.MeshPhongMaterial({
				map: loader.load(textures.map),
				bumpMap: loader.load(textures.bumpMap),
				bumpScale: textures.bumpScale || 0.02,
				specular: new THREE.Color(0x333333),
				shininess: 15
			});

			const planetMesh = new THREE.Mesh(geometry, material);
			planetMesh.userData = { name }; // Добавляем данные для идентификации планеты
			group.add(planetMesh);

			return group;
		}

		const sunGroup = createPlanetGroup({
			name: "Sun",
			position: { x: 0, y: 0, z: 0 },
			textures: { map: textures.sun },
			size: 3
		});
		planets.push(sunGroup);

		const earthGroup = createPlanetGroup({
			name: "Earth",
			position: { x: orbits.Earth.radius, y: 0, z: 0 },
			textures: { map: textures.earth }
		});
		planets.push(earthGroup);

		const marsGroup = createPlanetGroup({
			name: "Mars",
			position: { x: orbits.Mars.radius, y: 0, z: 0 },
			textures: { map: textures.mars }
		});
		planets.push(marsGroup);

		const jupiterGroup = createPlanetGroup({
			name: "Jupiter",
			position: { x: orbits.Jupiter.radius, y: 0, z: 0 },
			textures: { map: textures.jupiter }
		});
		planets.push(jupiterGroup);

		planets.forEach(planet => scene.add(planet));
		const stars = getStarfield(20000);
		scene.add(stars);

		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		function onMouseClick(event) {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(planets.map(p => p.children[0]));

			if (intersects.length > 0) {
				const planet = intersects[0].object;
				setSelectedPlanet(planet.userData.name); // Сохраняем выбранную планету
				focusOnPlanet(planet);
			}
		}

		function focusOnPlanet(planet) {
			const planetPosition = new THREE.Vector3();
			planet.getWorldPosition(planetPosition);

			new TWEEN.Tween(camera.position)
				.to({
					x: planetPosition.x,
					y: planetPosition.y,
					z: planetPosition.z + 5 // Приближаемся к планете
				}, 1000)
				.easing(TWEEN.Easing.Quadratic.InOut)
				.start();
		}

		refContainer.current && refContainer.current.appendChild(renderer.domElement);
		window.addEventListener('click', onMouseClick);

		var animate = function animate() {
			requestAnimationFrame(animate);
			time += 0.01;

			updatePlanetPosition(earthGroup, orbits.Earth, time);
			updatePlanetPosition(marsGroup, orbits.Mars, time);
			updatePlanetPosition(jupiterGroup, orbits.Jupiter, time);

			planets.forEach(planet => {
				planet.rotation.y += 0.01;
			});

			stars.rotation.y -= 0.0002;

			TWEEN.update(); // Обновляем анимации
			renderer.render(scene, camera);
		};

		animate();

		return () => {
			window.removeEventListener('click', onMouseClick);
		};
	}, []);

	return (
		<div ref={refContainer}>
			{selectedPlanet && (
				<div style={{
					position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', color: '#fff'
				}}>
					<h2>{selectedPlanet}</h2>
					<p>Информация о планете {selectedPlanet}...</p>
				</div>
			)}
		</div>
	);
}

export default Planetarium;
