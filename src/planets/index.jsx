import * as THREE from 'three';
import * as TWEEN from 'tween';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import "./Style.css";

import { useEffect, useRef , useState } from "react";
import React, { Component } from 'react';

import getStarfield from "./starfield";
// import createOrbitEat from "./planetsOrbits"


let time_delay = 0.1;


function GenTable(props) {
// Check if data is available and is an array
	if (!props.data || !Array.isArray(props.data)) {
	    return <div>No data available</div>; // Fallback in case data is not an array
	}

	const listItems = props.data.map((attr, index) => (
	    <React.Fragment key={index} >
	        <dt style={{ display: 'inline', color: '#ffffff', marginRight: '3rem' , fontSize: "1.5rem" , marginBottom: "10px"}}>{attr.name}</dt>
	        <dd style={{ display: 'inline',  fontWeight: 'bold',  color: '#cccccc', marginRight: '20px' , fontSize: "1.5rem" }}>{attr.value}</dd>
	        <br/>
	    </React.Fragment>
	));

	return <dl style={{ }}>{listItems}</dl>;
}

function hidePlanetInfo(planetName) {
	time_delay = 0.1;
    const infoContainer = document.getElementById("cardsCont");
    const planetCard = document.getElementById(planetName);
    infoContainer.style.display = "none";
    planetCard.style.display = "none";
}

function hideAllPlanetInfo() {
	time_delay = 0.1;
    const infoContainer = document.getElementById("cardsCont");
    const planetCards = infoContainer.childNodes;
    planetCards.forEach(x => x.style.display = "none");

}

function PlanetCard(props) {
    const [activeTab, setActiveTab] = useState('desc');
    const [desc, setDesc] = useState('');
    const [enc, setEnc] = useState([]); // Ensure enc is an array
    const [struc, setStruc] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch(props.data);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const jsonData = await response.json();
            // Debugging output to check the fetched data
            console.log("Fetched data:", jsonData);
            setDesc(jsonData.desc);
            setEnc(jsonData.enc); // This should be an array
            setStruc(jsonData.struc);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

  	useEffect(() => {
  		
  	});

    useEffect(() => {
        fetchData();
    }, [props.data]);

    const renderContent = () => {
        switch (activeTab) {
            case 'desc':
                return <div>{desc}</div>;
            case 'enc':
                return <GenTable data={enc} />;
            case 'struc':
                return <GenTable data={struc} />;
            default:
                return null;
        }
    };

    return (
        <div style={{
        		flexFlow: "column nowrap"
        }} class="cards" id={props.name+"Card"}>
            <div style={{ display: "flex", flexFlow: "row nowrap" , justifyContent: "space-around" , alignItems: "center" }}>
            	<button
            		style= {{
            			border: 0,
            			background: "none",
            		}} 
            	 onClick={ () =>{ hidePlanetInfo(props.name+"Card") } }>
            		<img style={{ size: "1.5rem" }} src="./back.png" />
            	</button> 
                <h1 style={{ color: "white", fontFamily: "Arial" , fontSize: "3rem"}}>{props.name}</h1>
            </div>
            <div style={{ color: "white", fontFamily: "Arial", display: "flex", flexFlow: "row nowrap", alignItems: "center", justifyContent: "space-around" }}>
                <span onClick={() => setActiveTab('desc')} style={{ borderBottom: activeTab === 'desc' ? '2px solid #ffffff' : 'none' }}>Description</span>
                <span onClick={() => setActiveTab('enc')} style={{ borderBottom: activeTab === 'enc' ? '2px solid #ffffff' : 'none' }}>Encyclopedia</span>
                <span onClick={() => setActiveTab('struc')} style={{ borderBottom: activeTab === 'struc' ? '2px solid #ffffff' : 'none' }}>Structure</span>
            </div>

            <div style={{ 	color: "white" ,
        					fontFamily: "Arial"}}>
                {renderContent()}
            </div>
        </div>
    );
}




function Planetarium(props) {
	const refContainer = useRef(null);

	const [value, setValue] = useState(0.01); 
       
    function changeValue(event) { 
        setValue(event.target.value);  
    }

	useEffect(() => {

		document.title = `Привет ${value}`;

		if (refContainer.current && refContainer.current.firstChild) {
        	refContainer.current.removeChild(refContainer.current.firstChild);
        }

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
		renderer.setPixelRatio(window.devicePixelRatio);


		time_delay = 0.1;
		// console.log(time_delay);





		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		window.addEventListener('click', onPlanetClick, false);

		function onPlanetClick(event) {
		    // Координаты мыши относительно экрана
		    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		    // Обновляем Raycaster
		    raycaster.setFromCamera(mouse, camera);

		    // Проверяем пересечения с планетами
		    const intersects = raycaster.intersectObjects(scene.children, true);

		    if (intersects.length > 0) {
		        const selectedPlanet = intersects[0].object;
		        if(!selectedPlanet.isPlanet) {
		        	return;
		        }

		        hideAllPlanetInfo();

		        // Отображаем информацию о выбранной планете
		        showPlanetInfo(selectedPlanet.name);

		        // Плавно перемещаем камеру к выбранной планете
		        time_delay = 0;
		        moveToPlanet(selectedPlanet);
		    }
		}

		// Функция для плавного перемещения камеры к планете
		function moveToPlanet(planet) {
			const initialPosition = {
				x: camera.position.x,
				y: camera.position.y,
				z: camera.position.z
			};

			// Настройка конечной позиции с учётом безопасного расстояния
			const targetDistance = 15; // регулируйте в зависимости от масштаба сцены
			const direction = new THREE.Vector3()
				.subVectors(camera.position, planet.position)
				.normalize()
				.multiplyScalar(targetDistance);

			const targetPosition = {
				x: planet.position.x + direction.x,
				y: planet.position.y + direction.y, // немного выше
				z: planet.position.z + direction.z // немного дальше
			};

			// Настройки Tween для плавного перемещения камеры
			new TWEEN.Tween(initialPosition)
				.to(targetPosition, 2000)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
					camera.lookAt(new THREE.Vector3(planet.position.x, planet.position.y, planet.position.z));
				})
				.start();

			// Убедитесь, что матрица проекции камеры обновляется
			camera.updateProjectionMatrix();


		}

		function showPlanetInfo(planetName) {
			const infoContainer = document.getElementById("cardsCont");
			console.log(planetName+"Card");
			const nameElement = document.getElementById(planetName+"Card");

			infoContainer.style.display = "block";
			nameElement.style.display = "flex";

		}

		// Функция для скрытия информации
		function hidePlanetInfo() {
		    const infoContainer = document.getElementById("planetInfo");
		    infoContainer.classList.remove("visible");
		}







		let time = 0;


		const controls = new OrbitControls(camera, renderer.domElement);

		// Массив для хранения всех планетных групп
		const planets = []; 

		const loader = new THREE.TextureLoader();
		const detail = 12;

		// Параметры орбит планет (радиус и скорость)
		const data_planets = {
			"Mercury": {
				"a": 0.387098,
				"e": 0.20563,
				"i": 7,
				"omega": 48.331,
				"arg_peri": 77.45645,
				"tau": 29.124,
				"P": 88,
				"speed": 47.87
			},
			"Venus": {
				"a": 0.723332,
				"e": 0.006772,
				"i": 3.4,
				"omega": 76.68,
				"arg_peri": 131.53298,
				"tau": 54.884,
				"P": 224.701,
				"speed": 35.02
			},
			"Earth": {
				"a": 1,
				"e": 0.016708,
				"i": 0,
				"omega": 11.2606,
				"arg_peri": 102.94719,
				"tau": 114.208,
				"P": 365.256363,
				"speed": 30
			},
			"Mars": {
				"a": 1.523679,
				"e": 0.0934,
				"i": 1.852,
				"omega": 49.558,
				"arg_peri": 336.04084,
				"tau": 286.502,
				"P": 686.971,
				"speed": 24.07
			},
			"Jupiter": {
				"a": 5.2044,
				"e": 0.0489,
				"i": 1.299,
				"omega": 100.464,
				"arg_peri": 14.75385,
				"tau": 273.867,
				"P": 4332.59,
				"speed": 13.07
			},
			"Saturn": {
				"a": 9.5826,
				"e": 0.0565,
				"i": 2.494,
				"omega": 113.665,
				"arg_peri": 92.43194,
				"tau": 339.392,
				"P": 10759.22,
				"speed": 9.69
			},
			"Uran": {
				"a": 19.2184,
				"e": 0.046381,
				"i": 0.8,
				"omega": 74.006,
				"arg_peri": 170.96424,
				"tau": 96.9989,
				"P": 30688.5,
				"speed": 6.81
			},
			"Neptune": {
				"a": 30.110387,
				"e": 0.009456,
				"i": 1.8,
				"omega": 131.784,
				"arg_peri": 44.97135,
				"tau": 276.336,
				"P": 60182,
				"speed": 5.43
			},
			"Pluton": {
				"a": 39.48,
				"e": 0.2488,
				"i": 17.2,
				"omega": 110.299,
				"arg_peri": 224.06676,
				"tau": 113.834,
				"P": 90560,
				"speed": 6.29
			}
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
			uran: "./textures/2k_uranus.jpg",
			uran_b: "./textures/2k_uranus.jpg",
			neptune: "./textures/2k_neptune.jpg",
			neptune_b: "./textures/2k_neptune.jpg",
			mercury: "./textures/2k_mercury.jpg",
			mercury_b: "./textures/2k_mercury.jpg",
			venus: "./textures/2k_venus_surface.jpg",
			venus_b: "./textures/2k_venus_surface.jpg",
			saturn: "./textures/2k_saturn.jpg",
			saturn_b: "./textures/2k_saturn.jpg"
		}

		let orbits_points = {};

		//--------- Функнции для планет ---------//

		// // Создание орбиты
		// function createOrbit(radius) {
		// 	const orbitGeometry = new THREE.RingGeometry(radius - 0.05, radius + 0.05, 640);
		// 	const orbitMaterial = new THREE.MeshBasicMaterial({
		// 		color: 0xffffff,
		// 		side: THREE.DoubleSide,
		// 		transparent: true,
		// 		opacity: 0.5
		// 	});
		// 	const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
		// 	orbit.rotation.x = Math.PI / 2;
		// 	return orbit;
		// }

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


		function createPlanetGroup({ name, position, textures , orbit_data , size=1}) {
			const geometry = new THREE.SphereGeometry(size , 64 , 64);
			const material = new THREE.MeshBasicMaterial({
				map: loader.load(textures.map)
			});


			const planetMesh = new THREE.Mesh(geometry, material);


			const start_orbit = createOrbitPoints(orbit_data)[0];
			planetMesh.position.set(start_orbit[0]*20, start_orbit[1]*20, start_orbit[2]*20);
			planetMesh.isPlanet = true;
			planetMesh.name = name;

			return planetMesh;
		}

		// Функция для обновления позиции планеты на орбите
		function updatePlanetPosition(planetGroup,  orbitParams, time) {
			const orbitPoints = createOrbitPoints(orbitParams);
		    const moment = Math.floor((time * orbitParams.speed/10) % 1000); // Индекс точки на орбите
		    const [x, y, z] = orbitPoints[moment].map(coord => coord * 20); // Увеличиваем масштаб
			const rotatedY = y * Math.cos(Math.PI / 2) - z * Math.sin(Math.PI / 2);
    		const rotatedZ = y * Math.sin(Math.PI / 2) + z * Math.cos(Math.PI / 2);

    		planetGroup.position.set(x, rotatedY, rotatedZ);

		}



		function createOrbitEat(data_planet) {
			let points = [];
			let points_coord = createOrbitPoints(data_planet);
			const zoom = 20.0;
			for (let i = 0; i < points_coord.length; i++) {
					points.push(new THREE.Vector3(points_coord[i][0]*zoom, points_coord[i][1]*zoom, points_coord[i][2]*zoom)); // Z = 0, так как орбита в плоскости X-Y
			}

			// Генерация геометрии линии на основе точек орбиты
			const geometry = new THREE.BufferGeometry().setFromPoints(points);

			// Создание материала для линии орбиты
			const material = new THREE.LineBasicMaterial({ color: 0xffff00 });

			// Создание линии
			const orbitLine = new THREE.Line(geometry, material);

			orbitLine.rotation.x = Math.PI / 2;


			return orbitLine;
		}

		function createOrbitFromPoints(points) {
			
			// console.log(data_planet);
			// let points_coord = createOrbitPoints(data_planet);
			// const zoom = 20.0;
			// for (let i = 0; i < points_coord.length; i++) {
			// 		points.push(new THREE.Vector3(points_coord[i][0]*zoom, points_coord[i][1]*zoom, points_coord[i][2]*zoom)); // Z = 0, так как орбита в плоскости X-Y
			// }

			// console.log(points)

			// // Генерация геометрии линии на основе точек орбиты
			// const geometry = new THREE.BufferGeometry().setFromPoints(points);

			// // Создание материала для линии орбиты
			// const material = new THREE.LineBasicMaterial({ color: 0xffff00 });

			// // Создание линии
			// const orbitLine = new THREE.Line(geometry, material);

			// orbitLine.rotation.x = Math.PI / 2;


			// return orbitLine;
		}



		function createOrbitPoints (data) {
			// Константы для орбиты
			const G = 6.67430e-11; // гравитационная постоянная

			// Функция для расчета координат орбиты
			function calculateOrbit(semiMajorAxis, eccentricity, inclination, omega, argPerihelion, tau, orbitalPeriod, numPoints = 1000) {
					// Рассчитываем полумалую ось
					const b = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

					// Генерируем точки на эллипсе (2D)
					const coords = [];
					for (let i = 0; i < numPoints; i++) {
							const theta = 2 * Math.PI * i / numPoints;
							const x = semiMajorAxis * Math.cos(theta);
							const y = b * Math.sin(theta);
							coords.push([x, y, 0]);
					}

					// Преобразуем в 3D с использованием матриц вращения
					const rotatedCoords = coords.map(([x, y, z]) => {
							// Поворот по наклону (inclin)
							let [x_inc, y_inc, z_inc] = rotate3D(x, y, z, inclination, 0, 1, 0);
							
							// Поворот по долготе восходящего узла (omega)
							[x_inc, y_inc, z_inc] = rotate3D(x_inc, y_inc, z_inc, omega, 0, 0, 1);
							
							// Поворот по аргументу перигелия (argPerihelion)
							[x_inc, y_inc, z_inc] = rotate3D(x_inc, y_inc, z_inc, argPerihelion, 1, 0, 0);
							
							return [x_inc, y_inc, z_inc];
					});

					return rotatedCoords;
			}

			// Функция для поворота точки в 3D
			function rotate3D(x, y, z, angle, axisX, axisY, axisZ) {
					const cosA = Math.cos(angle);
					const sinA = Math.sin(angle);
					const oneMinusCosA = 1 - cosA;

					const rotMatrix = [
							[
									cosA + axisX * axisX * oneMinusCosA,
									axisX * axisY * oneMinusCosA - axisZ * sinA,
									axisX * axisZ * oneMinusCosA + axisY * sinA
							],
							[
									axisY * axisX * oneMinusCosA + axisZ * sinA,
									cosA + axisY * axisY * oneMinusCosA,
									axisY * axisZ * oneMinusCosA - axisX * sinA
							],
							[
									axisZ * axisX * oneMinusCosA - axisY * sinA,
									axisZ * axisY * oneMinusCosA + axisX * sinA,
									cosA + axisZ * axisZ * oneMinusCosA
							]
					];

					const newX = rotMatrix[0][0] * x + rotMatrix[0][1] * y + rotMatrix[0][2] * z;
					const newY = rotMatrix[1][0] * x + rotMatrix[1][1] * y + rotMatrix[1][2] * z;
					const newZ = rotMatrix[2][0] * x + rotMatrix[2][1] * y + rotMatrix[2][2] * z;

					return [newX, newY, newZ];
			}

			// Решение уравнения Кеплера для расчета истинной аномалии
			function keplerSolve(eccentricity, meanAnomaly, tolerance = 1e-6) {
					let E = meanAnomaly;
					let delta = tolerance + 1;
					
					while (delta > tolerance) {
							const newE = E - (E - eccentricity * Math.sin(E) - meanAnomaly) / (1 - eccentricity * Math.cos(E));
							delta = Math.abs(newE - E);
							E = newE;
					}

					return E;
			}

			// Пример вызова функции
			const semiMajorAxis = data.a; // Пример данных
			const eccentricity = data.e;
			const inclination = data.i/57; // 30 градусов
			const omega = data.i/57; // 45 градусов
			const argPerihelion = data.arg_peri*0; // 60 градусов
			const tau = data.tau;
			const orbitalPeriod = data.P; // дни

			const orbitCoords = calculateOrbit(semiMajorAxis, eccentricity, inclination, omega, argPerihelion, tau, orbitalPeriod);
			return orbitCoords;
		}


		//--------- Солнце ---------//

		// Создание Солнца с эффектом свечения
		let sunGroup;
		{
			const geometry = new THREE.SphereGeometry(5, 64 , 64);
			const material = new THREE.MeshBasicMaterial({
				map: loader.load(textures.sun)
			});


			const planetMesh = new THREE.Mesh(geometry, material);


			planetMesh.position.set(0, 0, 0);
			planetMesh.name = "Sun"

			sunGroup = planetMesh;
		}

		planets.push(sunGroup);

		// Добавление свечения вокруг Солнца
		addGlowEffect(sunGroup, 10.9171);





		//--------- Земля ---------//



		const earthGroup = createPlanetGroup({
			name: "Earth",
			position: { },
			textures: {
				map: textures.earth,
				bumpMap: textures.earth_b,
				bumpScale: 0.04,
			},
			orbit_data: data_planets.Earth,
			size:2.5
		});
		scene.add(earthGroup);

		// Создание орбиты Земли
		const earthOrbit = createOrbitEat(data_planets.Earth);
		scene.add(earthOrbit);

		// const geometry = new THREE.SphereGeometry(5 , 64 , 64);
		// const material = new THREE.MeshBasicMaterial({
		// 	map: loader.load(textures.earth)
		// });


		// const planetMesh = new THREE.Mesh(geometry, material);
		// planetMesh.position.x = data_planets.Earth.a*30;
		// scene.add(planetMesh);





		//--------- Марс ---------//

		const marsGroup = createPlanetGroup({
			name: "Mars",
			position: { x: data_planets.Mars.a*2, y: 0, z: 0 },
			textures: {
				map: textures.mars,
				bumpMap: textures.mars_b,
				bumpScale: 0.02,
			},
			orbit_data: data_planets.Mars,
			size:2
		});
		planets.push(marsGroup);

		// Создание орбиты Марса
		const marsOrbit = createOrbitEat(data_planets.Mars);
		scene.add(marsOrbit);







		//--------- Юпитер ---------//

		const jupiterGroup = createPlanetGroup({
			name: "Jupiter",
			position: { x: data_planets.Jupiter.a*2, y: 0, z: 0 },
			textures: {
				map: textures.jupiter,
				bumpMap: textures.jupiter_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Jupiter,
			size:3
		});
		planets.push(jupiterGroup);

		// Создание орбиты Юпитер
		const jupiterOrbit = createOrbitEat(data_planets.Jupiter);
		scene.add(jupiterOrbit);






		//--------- Меркурий ---------//

		const mercuryGroup = createPlanetGroup({
			name: "Mercury",
			position: { },
			textures: {
				map: textures.mercury,
				bumpMap: textures.mercury_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Mercury,
			size:1.5
		});
		planets.push(mercuryGroup);

		// Создание орбиты Юпитер
		const mercuryOrbit = createOrbitEat(data_planets.Mercury);
		scene.add(mercuryOrbit);






		//--------- Венера ---------//

		const venusGroup = createPlanetGroup({
			name: "Venus",
			position: {  },
			textures: {
				map: textures.venus,
				bumpMap: textures.venus_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Venus,
			size:1.5
		});
		planets.push(venusGroup);

		// Создание орбиты Юпитер
		const venusOrbit = createOrbitEat(data_planets.Venus);
		scene.add(venusOrbit);






		//--------- Сатурн ---------//

		const saturnGroup = createPlanetGroup({
			name: "Saturn",
			position: { x: data_planets.Saturn.a*2, y: 0, z: 0 },
			textures: {
				map: textures.saturn,
				bumpMap: textures.saturn_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Saturn,
			size:2.6
		});
		planets.push(saturnGroup);

		// Создание орбиты Юпитер
		const saturnOrbit = createOrbitEat(data_planets.Saturn);
		scene.add(saturnOrbit);





		//--------- Нептун ---------//

		const neptuneGroup = createPlanetGroup({
			name: "Neptune",
			position: { x: data_planets.Neptune.a*2, y: 0, z: 0 },
			textures: {
				map: textures.neptune,
				bumpMap: textures.neptune_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Neptune,
			size:2
		});
		planets.push(neptuneGroup);

		// Создание орбиты Юпитер
		const neptuneOrbit = createOrbitEat(data_planets.Neptune);
		scene.add(neptuneOrbit);





		//--------- Уран ---------//

		const uranGroup = createPlanetGroup({
			name: "Uran",
			position: { x: data_planets.Jupiter.a*2, y: 0, z: 0 },
			textures: {
				map: textures.uran,
				bumpMap: textures.uran_b,
				bumpScale: 0.03,
			},
			orbit_data: data_planets.Uran,
			size: 8
		});
		planets.push(uranGroup);

		// Создание орбиты Юпитер
		const uranOrbit = createOrbitEat(data_planets.Uran);
		scene.add(uranOrbit);








		// Конфигурация Сцены 2 часть
		planets.forEach(planet => scene.add(planet));

		console.error(planets.length);

		
		// Звёздное поле
		const stars = getStarfield(20000);
		console.warn(stars);
		scene.add(stars);



		// Добавление освещения

		//	Точечный свет, имитирующий Солнце
		const sunLight = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);
		const sunLight1 = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);
		const sunLight2 = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);
		const sunLight3 = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);
		const sunLight4 = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);
		const sunLight5 = new THREE.PointLight(0xffffff, 10000, 1000, 0.5);

		sunLight.position.set(15, 0, 0); // Солнце в центре
		sunLight1.position.set(-15, 0, 0); // Солнце в центре
		sunLight2.position.set(0, 15, 0); // Солнце в центре
		sunLight3.position.set(0, -15, 0); // Солнце в центре
		sunLight4.position.set(0, 0, 15); // Солнце в центре
		sunLight5.position.set(0, 0, -15); // Солнце в центре

		scene.add(sunLight);
		scene.add(sunLight1);
		scene.add(sunLight2);
		scene.add(sunLight3);
		scene.add(sunLight4);
		scene.add(sunLight5);






		refContainer.current && refContainer.current.appendChild( renderer.domElement );

		var animate = function animate() {
			requestAnimationFrame(animate);

			time += time_delay; // Обновляем время для изменения позиций планет

			// Обновляем позиции планет на орбите
			updatePlanetPosition(earthGroup, data_planets.Earth , time);
			updatePlanetPosition(marsGroup, data_planets.Mars , time);
			updatePlanetPosition(jupiterGroup, data_planets.Jupiter , time);
			updatePlanetPosition(neptuneGroup, data_planets.Neptune , time);
			updatePlanetPosition(saturnGroup, data_planets.Saturn , time);
			updatePlanetPosition(uranGroup, data_planets.Uran , time);
			updatePlanetPosition(venusGroup, data_planets.Venus , time);
			updatePlanetPosition(mercuryGroup, data_planets.Mercury , time);

			earthGroup.rotation.y += 0.01;
			marsGroup.rotation.y += 0.01;
			jupiterGroup.rotation.y += 0.01;
			neptuneGroup.rotation.y += 0.01;
			saturnGroup.rotation.y += 0.01;
			uranGroup.rotation.y += 0.01;
			venusGroup.rotation.y += 0.01;
			mercuryGroup.rotation.y += 0.01;


			TWEEN.update();
			

			renderer.render(scene, camera);
		}

		animate();
	});

	return (
		<>
		<div id="cardsCont" style={{	position: "absolute",
						left: 0,
						top: "20%",
						height: "60%",
						width: "25%",
						background: "black",
						overflowX: "hidden",
						display: "none"}}>
			<PlanetCard  id="EarthCard" name="Earth" data="./data/Earth.json"/>
			<PlanetCard  id="MarsCard" name="Mars" data="./data/Mars.json"/>
			<PlanetCard  id="SaturnCard" name="Saturn" data="./data/Saturn.json"/>
			<PlanetCard  id="JupiterCard" name="Jupiter" data="./data/Jupiter.json"/>
			<PlanetCard  id="VenusCard" name="Venus" data="./data/Venus.json"/>
			<PlanetCard  id="MercuryCard" name="Mercury" data="./data/Mercury.json"/>
			<PlanetCard  id="NepruneCard" name="Neprune" data="./data/Neptune.json"/>
			<PlanetCard  id="UranCard" name="Uran" data="./data/Uran.json"/>
			<PlanetCard  id="SunCard" name="Sun" data="./data/Sun.json"/>

		</div>

		<div ref={refContainer}></div>


		</>
	);
}










export { Planetarium, PlanetCard};
