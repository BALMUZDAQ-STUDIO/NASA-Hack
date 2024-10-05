import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { useEffect, useRef } from "react";

import getStarfield from "./starfield.js";

function Planetarium() {
	const refContainer = useRef(null);

	useEffect(() => {

		// Конфигурация размеров холста
		const w = window.innerWidth;
		const h = window.innerHeight;
		
		// Конфигурация холста и сцены
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
		camera.position.z = 30;
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(w, h);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.outputColorSpace = THREE.LinearSRGBColorSpace;


		let time = 0;


		const controls = new OrbitControls(camera, renderer.domElement);

		// Массив для хранения всех планетных групп
		const planets = []; 

		const loader = new THREE.TextureLoader();
		const detail = 12;

		// Параметры орбит планет (радиус и скорость)
		const orbits = {
			Earth: { radius: 15, speed: 1 },
			Mars: { radius: 20, speed: 0.5 },
			Jupiter: { radius: 28, speed: 0.2 }
		};


		const textures = {
			sun: "./textures/2k_sun.jpg",
			sun_b: "./textures/2k_sun.jpg",
			earth: "./textures/00_earthmap1k.jpg",
			earth_b: "./textures/01_earthmap1k.jpg",
			mars: "./textures/2k_mars.jpg",
			mars_b: "./textures/2k_mars.jpg",
			jupiter: "./textures/2k_jupiter.jpg",
			jupiter_b: "./textures/2k_jupiter.jpg",

		}

		//--------- Функнции для планет ---------//

		// Создание орбиты
		function createOrbit(radius) {
			const orbitGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 640);
			const orbitMaterial = new THREE.MeshBasicMaterial({
				color: 0xffffff,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.5
			});
			const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
			orbit.rotation.x = Math.PI / 2;
			return orbit;
		}

		// Создание эффекта свечения
		function addGlowEffect(object, size) {
			const spriteMaterial = new THREE.SpriteMaterial({
				map: loader.load('./textures/glow.png'), // текстура свечения
				transparent: true,
				blending: THREE.AdditiveBlending
			});

			const sprite = new THREE.Sprite(spriteMaterial);
			sprite.scale.set(size, size, 1); // Настройка размера свечения
			object.add(sprite);
		}

		// Функция для создания группы планеты
		function createPlanetGroup({ name, position, textures , size=1}) {
			const group = new THREE.Group();
			group.position.set(position.x, position.y, position.z);

			const geometry = new THREE.IcosahedronGeometry(size, detail);
			const material = new THREE.MeshPhongMaterial({
				map: loader.load(textures.map),
				bumpMap: loader.load(textures.bumpMap),
				bumpScale: textures.bumpScale || 0.02,
				specular: new THREE.Color(0x333333), // Добавляем блеск
				shininess: 15 // Увеличиваем блеск
			});

			const planetMesh = new THREE.Mesh(geometry, material);
			group.add(planetMesh);

			return group;
		}

		// Функция для обновления позиции планеты на орбите
		function updatePlanetPosition(planetGroup, orbitParams, time) {
			const { radius, speed } = orbitParams;
			planetGroup.position.x = radius * Math.cos(time * speed);
			planetGroup.position.z = radius * Math.sin(time * speed);
		}









		//--------- Солнце ---------//

		// Создание Солнца с эффектом свечения
		const sunGroup = createPlanetGroup({
			name: "Sun",
			position: { x: 0, y: 0, z: 0 },
			textures: {
				map: textures.sun,
				bumpMap: textures.sun_b,
				bumpScale: 0.00,
			},
			size:3
		});
		planets.push(sunGroup);

		// Добавление свечения вокруг Солнца
		addGlowEffect(sunGroup, 10);





		//--------- Земля ---------//

		const earthGroup = createPlanetGroup({
			name: "Earth",
			position: { x: orbits.Earth.radius, y: 0, z: 0 },
			textures: {
				map: textures.earth,
				bumpMap: textures.earth_b,
				bumpScale: 0.04,
			}
		});
		planets.push(earthGroup);

		// Создание орбиты Земли
		const earthOrbit = createOrbit(orbits.Earth.radius);
		scene.add(earthOrbit);







		//--------- Марс ---------//

		const marsGroup = createPlanetGroup({
			name: "Mars",
			position: { x: orbits.Mars.radius, y: 0, z: 0 },
			textures: {
				map: "./textures/2k_mars.jpg",
				bumpMap: "./textures/2k_mars.jpg",
				bumpScale: 0.02,
			}
		});
		planets.push(marsGroup);

		// Создание орбиты Марса
		const marsOrbit = createOrbit(orbits.Mars.radius);
		scene.add(marsOrbit);







		//--------- Юпитер ---------//

		const jupiterGroup = createPlanetGroup({
			name: "Jupiter",
			position: { x: orbits.Jupiter.radius, y: 0, z: 0 },
			textures: {
				map: textures.jupiter,
				bumpMap: textures.jupiter_b,
				bumpScale: 0.03,
			}
		});
		planets.push(jupiterGroup);

		// Создание орбиты Юпитер
		const jupiterOrbit = createOrbit(orbits.Jupiter.radius);
		scene.add(jupiterOrbit);




		// Конфигурация Сцены 2 часть
		planets.forEach(planet => scene.add(planet));
		
		// Звёздное поле
		const stars = getStarfield(20000);
		console.warn(s
		scene.add(stars);



		// Добавление освещения

		//  Точечный свет, имитирующий Солнце
		const sunLight = new THREE.PointLight(0xffffff, 1000, 100);
		const sunLight1 = new THREE.PointLight(0xffffff, 1000, 100);
		const sunLight2 = new THREE.PointLight(0xffffff, 1000, 100);
		const sunLight3 = new THREE.PointLight(0xffffff, 1000, 100);
		const sunLight4 = new THREE.PointLight(0xffffff, 1000, 100);
		const sunLight5 = new THREE.PointLight(0xffffff, 1000, 100);

		sunLight.position.set(10, 0, 0); // Солнце в центре
		sunLight1.position.set(-10, 0, 0); // Солнце в центре
		sunLight2.position.set(0, 10, 0); // Солнце в центре
		sunLight3.position.set(0, -10, 0); // Солнце в центре
		sunLight4.position.set(0, 0, 10); // Солнце в центре
		sunLight5.position.set(0, 0, -10); // Солнце в центре

		scene.add(sunLight);
		scene.add(sunLight1);
		scene.add(sunLight2);
		scene.add(sunLight3);
		scene.add(sunLight4);
		scene.add(sunLight5);





		refContainer.current && refContainer.current.appendChild( renderer.domElement );

		var animate = function animate() {
			requestAnimationFrame(animate);

			time += 0.01; // Обновляем время для изменения позиций планет

			// Обновляем позиции планет на орбите
			updatePlanetPosition(earthGroup, orbits.Earth, time);
			updatePlanetPosition(marsGroup, orbits.Mars, time);
			updatePlanetPosition(jupiterGroup, orbits.Jupiter, time);

			planets.forEach(planet => {
				planet.rotation.y += 0.01; 
			});

			stars.rotation.y -= 0.0002;

			renderer.render(scene, camera);
		}

		animate();
	}, []);

	return (
		<div ref={refContainer}></div>

	);
}

export default Planetarium;
