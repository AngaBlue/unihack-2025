import * as THREE from 'three';

var scene, camera, renderer, light, controls;

var radius = 100,
	theta = 0;

var activeObjects = [];
var terrarium = [];

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 2.25;
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', onResize, false);
	function onResize() {
		width = window.innerWidth;
		height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height);
	}

	var light = new THREE.PointLight(0xf7aef8, 1);
	light.position.set(0, 205, 10);
	scene.add(light);

	var light = new THREE.HemisphereLight(0xffffff, 0x241623, 1);
	light.position.set(0, 205, 20);
	scene.add(light);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	//drag controls
	controls;
	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 1.5;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 2.5;
	controls.maxDistance = 5.5;
	controls.minDistance = 1.25;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	var dragControls = new THREE.DragControls(activeObjects, camera, renderer.domElement);
	dragControls.addEventListener('dragstart', event => {
		controls.enabled = false;
	});
	dragControls.addEventListener('dragend', event => {
		controls.enabled = true;
	});
}

function selectContainer() {
	var dirt = new THREE.MeshBasicMaterial({ color: 0xfff444 });
	var container, line, earth;
	var x, y, z;

	//toggle terrarium type
	var elements = document.getElementsByClassName('toggle');
	for (var i = 0; i < elements.length; i++) {
		elements[i].addEventListener(
			'click',
			function () {
				var check = this.getAttribute('class');
				if (check != 'toggle selected') {
					var i = this.getAttribute('id');
					eraseScene();
					assignClass(i);
				} else {
				}
			},
			false
		);
	}

	//erase old terrarium
	function eraseScene() {
		scene.remove(terrarium[2]);
		scene.remove(terrarium[1]);
		scene.remove(terrarium[0]);
	}

	//match container type
	function assignClass(i) {
		console.log('assignClass');
		switch (i) {
			case 'box':
				sqrTerr();
				break;
			case 'pyramid':
				triTerr();
				break;
			case 'sphere':
				circTerr();
				break;
		}
	}

	//start with a circular container
	circTerr();

	//square container
	function sqrTerr() {
		var box = new THREE.BoxGeometry(1.5, 1.5, 1.5);
		var earth = new THREE.BoxGeometry(1.45, 0.4, 1.5);
		var boxBottom = new THREE.Mesh(earth, dirt);
		boxBottom.position.y = -0.5;
		drawContainer(box, boxBottom);
	}

	//triangle container
	function triTerr() {
		var pyramid = new THREE.ConeGeometry(1.5, 2, 4);
		pyramid.rotateY(0.75);
		var earth = new THREE.CubeGeometry(1.8, 0.2, 1.8);
		var pyramidBottom = new THREE.Mesh(earth, dirt);
		pyramidBottom.position.y -= 0.85;
		pyramidBottom.rotation.y = 1.5;
		drawContainer(pyramid, pyramidBottom);
	}

	//circle container
	function circTerr() {
		var sphere = new THREE.DodecahedronGeometry(1.25, 0);
		sphere.rotateX(10);
		var earth = new THREE.CylinderBufferGeometry(1, 0.7, 0.45, 5);
		earth.rotateX(0);
		earth.rotateY(0);
		earth.translate(0, -0.75, 0);
		var sphereBottom = new THREE.Mesh(earth, dirt);
		drawContainer(sphere, sphereBottom);
	}

	function drawContainer(shape, earth) {
		//glass
		var glass = new THREE.MeshNormalMaterial({
			transparent: true,
			opacity: 0.2,
			color: 0xffffff,
			shading: THREE.FlatShading
		});
		var edges = new THREE.EdgesGeometry(shape);
		line = new THREE.LineSegments(
			edges,
			new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				linejoin: 'bevel',
				opacity: 0.8
			})
		);

		earth.material = new THREE.MeshToonMaterial();
		//randomize earth color
		earth.material.color = new THREE.Color(0xffffff * Math.random());
		earth.material.needsUpdate = true;

		var container = new THREE.Mesh(shape, glass);
		terrarium = [container, line, earth];

		scene.add(container, line, earth);
	}
}

function selectObjects() {
	var flowerColors = [0x6cdfea, 0xc3ff68, 0xd31996, 0x1b065e];
	var bigSelect;

	var addPyramid = document.getElementById('pyramidBtn');
	addPyramid.addEventListener('click', createPyramid, false);

	function createPyramid() {
		var geometry = new THREE.BoxGeometry(0.25, 0.35, 0.15);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var magicPyramid = new THREE.Mesh(geometry, material); //

		//pyramid
		var geometry = new THREE.ConeGeometry(0.25, 0.35, 4);
		var material = new THREE.MeshNormalMaterial();
		var cone = new THREE.Mesh(geometry, material);
		cone.rotation.y = 3.95;
		magicPyramid.add(cone);

		//eye
		var geometry = new THREE.SphereGeometry(0.085, 32, 16);
		var material = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, -0.05, 0.1);
		magicPyramid.add(sphere);

		//pupil
		var geometry = new THREE.BoxGeometry(0.085, 0.085, 0.05);
		var material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, -0.05, 0.18);
		mesh.rotation.z = Math.PI / 4;
		magicPyramid.add(mesh);

		activeObjects.push(magicPyramid);
		scene.add(magicPyramid);
	}

	var addUfo = document.getElementById('ufoBtn');
	addUfo.addEventListener('click', createUfo, false);

	function createUfo() {
		var geometry = new THREE.BoxGeometry(0.35, 0.25, 0.25);
		var material = new THREE.MeshToonMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var ufo = new THREE.Mesh(geometry, material);

		var geometry = new THREE.SphereGeometry(0.1, 4, 32);
		var material = new THREE.MeshToonMaterial({
			color: 0x3dccc7,
			shininess: 500
		});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, 0.035, 0);
		ufo.add(sphere);

		var geometry = new THREE.CylinderGeometry(0.05, 0.25, 0.15, 32);
		var material = new THREE.MeshToonMaterial({ color: 0x333333, reflectivity: 1000, shininess: 100 });
		var cylinder = new THREE.Mesh(geometry, material);
		ufo.add(cylinder);

		activeObjects.push(ufo);
		scene.add(ufo);
	}

	var addpalmTree = document.getElementById('palmBtn');
	addpalmTree.addEventListener('click', createpalmTree, false);

	function createpalmTree() {
		var geometry = new THREE.BoxGeometry(0.35, 1.5, 0.25);
		geometry.translate(0, 0.5, 0);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var palmTree = new THREE.Mesh(geometry, material);

		var geometry = new THREE.CylinderGeometry(0.35, 0.45, 0.5, 6);
		var material = new THREE.MeshNormalMaterial({ color: 0x948c75 });
		var palmBase = new THREE.Mesh(geometry, material);
		palmTree.add(palmBase);

		var geometry = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 6);
		var palmBase = new THREE.Mesh(geometry, material);
		palmBase.position.set(-0.025, 0.45, 0.0);
		palmBase.rotation.set(0, 0, 0.15);
		palmTree.add(palmBase);

		var geometry = new THREE.CylinderGeometry(0.05, 0.2, 0.5, 6);
		var palmBase = new THREE.Mesh(geometry, material);
		palmBase.position.set(-0.15, 0.85, 0.0);
		palmBase.rotation.set(0, 0, 0.35);
		palmTree.add(palmBase);

		var geometry = new THREE.CylinderGeometry(0.015, 0.04, 0.25, 6);
		var palmTrunkTop = new THREE.Mesh(geometry, material);
		palmTrunkTop.position.set(-0.28, 1.15, 0.025);
		palmTrunkTop.rotation.set(0.25, 0.5, 0.5);
		palmTree.add(palmTrunkTop);

		//LEAVES
		var leafShape = new THREE.Shape();
		leafShape.quadraticCurveTo(0, 5.5, 10, 5.5);
		leafShape.quadraticCurveTo(0, -5.5, 0, 2);

		var extrudeSettings = {
			steps: 1,
			amount: 0.005,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.5,
			bevelSegments: 0.5
		};

		var geometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);

		var material = new THREE.MeshToonMaterial({ color: 0x0ca4a5 });
		var Leaf = new THREE.Mesh(geometry, material);
		Leaf.scale.set(0.085, 0.085, 1);
		Leaf.position.set(-1.05, 0.5, 0);
		Leaf.rotation.set(18.5, 2.5, 2);
		palmTree.add(Leaf);

		pL = Leaf.clone();
		pL.position.set(0.3, 1.9, 0.15);
		pL.rotation.set(8.8, 0.5, 2);
		palmTree.add(pL);

		pL = Leaf.clone();
		pL.position.set(0.1, 0.8, 1.05);
		pL.rotation.set(-0.85, -3.5, 0.5);
		palmTree.add(pL);

		activeObjects.push(palmTree);
		scene.add(palmTree);
		palmTree.scale.set(0.35, 0.35, 0.35);
	}

	var addTallFlower = document.getElementById('tallBtn');
	addTallFlower.addEventListener('click', createTallFlower, false);

	function createTallFlower() {
		var geometry = new THREE.BoxBufferGeometry(0.1, 0.8, 0.1);
		geometry.translate(0, 0.35, 0.05);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var tallFlower = new THREE.Mesh(geometry, material);

		//LEAVES
		var leafShape = new THREE.Shape();
		leafShape.quadraticCurveTo(0, 5.5, 10, 5.5);
		leafShape.quadraticCurveTo(0, -5.5, 0, 2);

		var extrudeSettings = {
			steps: 1,
			amount: 0.005,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.5,
			bevelSegments: 0.5
		};

		var geometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
		var material = new THREE.MeshToonMaterial({ color: 0x1eef94 });
		var Leaf = new THREE.Mesh(geometry, material);
		Leaf.scale.set(0.045, 0.045, 1.5);
		Leaf.rotation.set(-1, -0.5, 0);
		tallFlower.add(Leaf);

		var newLeaf = Leaf.clone();
		newLeaf.rotation.set(-1.8, 0.2, 3.5);
		newLeaf.position.set(0.05, 0, 0);
		tallFlower.add(newLeaf);

		var geometry = new THREE.SphereGeometry(0.15, 0.15, 12);
		var material = new THREE.MeshToonMaterial({
			shininess: 100
		});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0.05, 0.15, 0.05);
		sphere.material.color = new THREE.Color(flowerColors[Math.floor(Math.random() * flowerColors.length)]);
		sphere.material.needsUpdate = true;
		tallFlower.add(sphere);

		var newSphere = sphere.clone();
		newSphere.scale.set(0.85, 0.85, 0.85);
		newSphere.position.set(0.025, 0.35, 0.05);
		tallFlower.add(newSphere);

		var newSphere = sphere.clone();
		newSphere.scale.set(0.65, 0.65, 0.65);
		newSphere.position.set(0, 0.55, 0.05);
		tallFlower.add(newSphere);

		var newSphere = sphere.clone();
		newSphere.scale.set(0.45, 0.45, 0.45);
		newSphere.position.set(0, 0.7, 0.05);
		tallFlower.add(newSphere);

		var newSphere = sphere.clone();
		newSphere.scale.set(0.25, 0.25, 0.25);
		newSphere.position.set(0, 0.8, 0.05);
		tallFlower.add(newSphere);

		activeObjects.push(tallFlower);
		scene.add(tallFlower);
	}

	var addSmallFlower = document.getElementById('smallBtn');
	addSmallFlower.addEventListener('click', createSmallFlower, false);

	function createSmallFlower() {
		var geometry = new THREE.BoxGeometry(0.25, 0.25, 0.08);
		geometry.translate(0, 0, 0.05);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var smallFlower = new THREE.Mesh(geometry, material);

		//LEAVES
		var leafShape = new THREE.Shape();
		leafShape.quadraticCurveTo(0, 5.5, 10, 5.5);
		leafShape.quadraticCurveTo(0, -5.5, 0, 2);

		var extrudeSettings = {
			steps: 1,
			amount: 0.005,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.5,
			bevelSegments: 0.5
		};

		var geometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
		var material = new THREE.MeshToonMaterial({ color: 0x1eef94 });
		var Leaf = new THREE.Mesh(geometry, material);
		Leaf.scale.set(0.025, 0.025, 1);
		Leaf.rotation.set(-1.3, 0, 0);
		smallFlower.add(Leaf);

		var newLeaf = Leaf.clone();
		newLeaf.rotation.set(1.4, 3, 0);
		newLeaf.position.set(0, -0.02, 0);
		smallFlower.add(newLeaf);

		var geometry = new THREE.SphereGeometry(0.1, 0.1, 3);
		var material = new THREE.MeshToonMaterial({
			shininess: 100
		});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0, 0.1, 0.05);
		sphere.material.color = new THREE.Color(flowerColors[Math.floor(Math.random() * flowerColors.length)]);
		sphere.material.needsUpdate = true;
		smallFlower.add(sphere);

		activeObjects.push(smallFlower);
		scene.add(smallFlower);
	}

	var addAlien = document.getElementById('alienBtn');
	addAlien.addEventListener('click', createAlien, false);
	function createAlien() {
		var geometry = new THREE.BoxGeometry(0.25, 0.55, 0.05);
		geometry.translate(0, -0.25, 0);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var alienGuy = new THREE.Mesh(geometry, material);

		var geometry = new THREE.SphereGeometry(0.03, 0.03, 8);
		var material = new THREE.MeshToonMaterial();
		var leftEye = new THREE.Mesh(geometry, material);
		leftEye.position.set(-0.05, -0.06, 0.05);
		leftEye.material.color = new THREE.Color(0x000000);
		alienGuy.add(leftEye);

		var rightEye = leftEye.clone();
		rightEye.position.set(0.06, -0.06, 0.05);
		alienGuy.add(rightEye);

		var geometry = new THREE.BoxGeometry(0.05, 0.015, 0);
		var alienMouth = new THREE.Mesh(geometry, material);
		alienMouth.position.set(0.01, -0.15, 0.055);
		alienGuy.add(alienMouth);

		var alienMouthLeft = alienMouth.clone();
		alienMouthLeft.position.set(-0.02, -0.14, 0.055);
		alienMouthLeft.scale.set(0.5, 1, 1);
		alienGuy.add(alienMouthLeft);

		var alienMouthRight = alienMouthLeft.clone();
		alienMouthRight.position.set(0.04, -0.14, 0.055);
		alienGuy.add(alienMouthRight);

		var alienHead = new THREE.Shape();
		alienHead.quadraticCurveTo(0, 5.5, 10, 5.5);
		alienHead.quadraticCurveTo(0, -5.5, 0, 5.5);

		var extrudeSettings = {
			steps: 1,
			amount: 0.05,
			bevelEnabled: true,
			bevelThickness: 5.05,
			bevelSize: 10.5,
			bevelSegments: 10
		};

		var geometry = new THREE.ExtrudeGeometry(alienHead, extrudeSettings);
		var material = new THREE.MeshToonMaterial({ color: 0x7fff24 });
		var alienHead = new THREE.Mesh(geometry, material);
		alienHead.scale.set(0.045, 0.045, 10);
		alienHead.rotation.set(0, 0, -2);
		alienGuy.add(alienHead);
		alienHead.scale.set(0.01, 0.01, 0.01);

		var geometry = new THREE.BoxGeometry(0.09, 0.2, 0.05);
		var material = new THREE.MeshToonMaterial({ color: 0x7fff24 });
		var alienBody = new THREE.Mesh(geometry, material);
		alienBody.position.set(0, -0.35, 0);
		alienGuy.add(alienBody);

		var geometry = new THREE.BoxGeometry(0.035, 0.15, 0.05);
		var alienRightArm = new THREE.Mesh(geometry, material);
		alienRightArm.position.set(-0.1, -0.4, 0);
		alienGuy.add(alienRightArm);

		var alienLeftArm = alienRightArm.clone();
		alienLeftArm.position.set(0.1, -0.4, 0);
		alienGuy.add(alienLeftArm);

		var alienRightLeg = alienRightArm.clone();
		alienRightLeg.position.set(-0.04, -0.5, 0);
		alienGuy.add(alienRightLeg);

		var alienLeftLeg = alienRightLeg.clone();
		alienLeftLeg.position.set(0.04, -0.5, 0);
		alienGuy.add(alienLeftLeg);

		activeObjects.push(alienGuy);
		scene.add(alienGuy);
	}

	var addSucculent = document.getElementById('succulentBtn');
	addSucculent.addEventListener('click', createSucculent, false);

	function createSucculent() {
		var geometry = new THREE.BoxGeometry(0.25, 0.15, 0.05);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var newSucculent = new THREE.Mesh(geometry, material);

		var leafShape = new THREE.Shape();
		leafShape.quadraticCurveTo(0, 5.5, 10, 5.5);
		leafShape.quadraticCurveTo(0, -5.5, 0, 2);

		var extrudeSettings = {
			steps: 1,
			amount: 0.005,
			bevelEnabled: true,
			bevelThickness: 0.025,
			bevelSize: 0.5,
			bevelSegments: 0.5
		};

		var geometry = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
		var material = new THREE.MeshToonMaterial({ color: 0x0ca4a5 });
		var Leaf = new THREE.Mesh(geometry, material);
		Leaf.scale.set(0.025, 0.025, 1);
		Leaf.rotation.set(-1.3, 0, 0);
		newSucculent.add(Leaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-1.5, -1, 0);
		//newLeaf.position.set(.15, 0, .15);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-1.5, -2, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-1.5, -3.25, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-10.5, -6.25, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-12.5, -7.25, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-10.5, -6.25, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(-6.5, -2, 0.01);
		newSucculent.add(newLeaf);

		newLeaf = Leaf.clone();
		newLeaf.rotation.set(1.9, 3, 0.01);
		newSucculent.add(newLeaf);

		activeObjects.push(newSucculent);
		scene.add(newSucculent);
	}

	var addCactus = document.getElementById('cactusBtn');
	addCactus.addEventListener('click', createCactus, false);

	function createCactus() {
		var geometry = new THREE.BoxGeometry(0.25, 0.55, 0.05);
		var material = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });
		var newCactus = new THREE.Mesh(geometry, material);

		var geometry = new THREE.SphereGeometry(0.085, 5, 3.5);
		var material = new THREE.MeshToonMaterial({ color: 0x004932, roughness: 0.8, shading: THREE.FlatShading });
		var cactusTop = new THREE.Mesh(geometry, material);
		cactusTop.rotation.set(0, -3.5, 0);
		cactusTop.position.set(0, 0.28, 0);

		var geometry = new THREE.CylinderGeometry(0.075, 0.075, 0.6, 5);
		var cactusArm = new THREE.Mesh(geometry, material);
		cactusArm.position.set(0, -0.1, 0);
		cactusArm.add(cactusTop);
		newCactus.add(cactusArm);

		newArm = cactusArm.clone();
		newArm.scale.set(0.85, 0.4, 0.85);
		newArm.position.set(-0.1, -0.025, 0);
		newArm.rotation.set(0, 0, 1.55);
		newCactus.add(newArm);

		secondArm = newArm.clone();
		newArm.rotation.set(0, 0, -1.55);
		newArm.position.set(0.1, 0.055, 0);
		newCactus.add(secondArm);

		activeObjects.push(newCactus);
		scene.add(newCactus);
	}

	function manipulateObjs() {
		//incremental size change
		var inc = 0.25;
		var zindex = 0.25;
		var currentObj = [];
		var activeObj;

		//add transparent state to selected objects
		document.addEventListener('mousedown', onDocumentMouseDown);
		function onDocumentMouseDown(event) {
			event.preventDefault();
			//detect when mouse is over object
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			//listen for clicks on objects or controls
			selectObj = raycaster.intersectObjects(activeObjects);

			if (selectObj.length > 0) {
				var lastObj = currentObj.pop();
				removeSelected(lastObj);

				activeObj = selectObj[0].object;
				currentObj.push(activeObj);

				//get parameter of selected mesh
				x = activeObj.scale.x;
				y = activeObj.scale.y;
				z = activeObj.scale.z;

				for (i = 0; i < activeObj.children.length; i++) {
					activeObj.children[i].material.opacity = 0.5;
				}
			} else {
				removeSelected(activeObj);
			}

			function removeSelected(lastObj) {
				if (lastObj) {
					for (i = 0; i < lastObj.children.length; i++) {
						lastObj.children[i].material.opacity = 1;
					}
				}
			}
		} //End MouseDown

		var rotateObj = document.getElementById('rotateBtn');
		rotateObj.addEventListener(
			'click',
			() => {
				activeObj.rotateY(0.5);
			},
			false
		);

		var removeObj = document.getElementById('removeBtn');
		removeObj.addEventListener('click', () => {
			for (var i = 0; i < activeObjects.length; i++) {
				if (activeObjects[i].uuid == activeObj.uuid) {
					activeObjects.splice(i, 1);
				}
			}
			scene.remove(activeObj);
		});

		var clearScene = document.getElementById('clearBtn');
		clearScene.addEventListener('click', () => {
			$(activeObjects).each(function () {
				scene.remove(this); //
			});
			activeObjects.length = 0;
			console.log(activeObjects);
		});

		var scaleUp = document.getElementById('scaleUp');
		scaleUp.addEventListener(
			'click',
			() => {
				if (x <= 5) {
					x += inc;
					y += inc;
					z += inc;
				}
				activeObj.scale.set(x, y, z);
			},
			false
		);

		var scaleDown = document.getElementById('scaleDown');
		scaleDown.addEventListener(
			'click',
			() => {
				if (x > 0.25) {
					x -= inc;
					y -= inc;
					z -= inc;
				}
				activeObj.scale.set(x, y, z);
			},
			false
		);

		var moveForward = document.getElementById('moveForward');
		moveForward.addEventListener(
			'click',
			() => {
				activeObj.position.z += zindex;
			},
			false
		);

		var moveBackward = document.getElementById('moveBackward');
		moveBackward.addEventListener(
			'click',
			() => {
				activeObj.position.z -= zindex;
			},
			false
		);
	} //end manipulate objects
	manipulateObjs();

	//set original terrarium
	function startScene() {
		createCactus();
		createPyramid();
		createTallFlower();
		createTallFlower();
		createSmallFlower();
		createUfo();
		createpalmTree();
		createAlien();
		createSucculent();
		createTallFlower();
		createSucculent();
		createSmallFlower();
		createSmallFlower();

		activeObjects[0].position.set(0.7, -0.3, 0.35);
		activeObjects[0].scale.set(0.75, 0.75, 0.75);
		activeObjects[1].position.set(0, -0.25, 0);
		activeObjects[1].scale.set(1.8, 1.8, 1.8);
		activeObjects[2].position.set(-0.55, -0.5, 0);
		activeObjects[2].scale.set(0.35, 0.35, 0.35);
		activeObjects[3].position.set(-0.65, -0.5, 0.25);
		activeObjects[3].scale.set(0.5, 0.5, 0.5);
		activeObjects[4].position.set(-0.35, -0.5, 0.45);
		activeObjects[4].scale.set(0.5, 0.5, 0.5);
		activeObjects[4].rotation.set(0, -0.75, 0);
		activeObjects[5].position.set(-0.35, 0.45, 0.05);
		activeObjects[6].position.set(0.55, -0.4, -0.25);
		activeObjects[6].scale.set(0.5, 0.5, 0.5);
		activeObjects[7].position.set(0.45, -0.1, 0.1);
		activeObjects[7].scale.set(0.75, 0.75, 0.75);
		activeObjects[8].position.set(-0.4, -0.5, -0.45);
		activeObjects[9].position.set(0.15, -0.5, -0.65);
		activeObjects[9].rotation.set(0, -0.85, 0);
		activeObjects[10].position.set(0.6, -0.5, 0.25);
		activeObjects[10].scale.set(0.5, 0.5, 0.5);
		activeObjects[11].position.set(0.2, -0.5, 0.65);
		activeObjects[12].position.set(-0.1, -0.5, 0.55);
		activeObjects[12].scale.set(0.25, 0.25, 0.25);
	}
	//Setup Initial Scene
	startScene();
}

function renderContainer() {
	var isAnimated = true;

	var addAnimation = document.getElementById('animateBtn');
	addAnimation.addEventListener(
		'click',
		function () {
			isAnimated = !isAnimated;
			$(this).toggleClass('active');
		},
		false
	);

	function animate() {
		requestAnimationFrame(animate);
		render();
	}
	function render() {
		if (isAnimated) {
			theta -= 0.5;
			camera.position.x = 2 * Math.sin(THREE.Math.degToRad(theta));
			camera.position.y = 0.25 * Math.sin(THREE.Math.degToRad(theta) + 200);
			camera.position.z = 2 * Math.cos(THREE.Math.degToRad(theta));

			// camera.updateMatrixWorld();

			//
		}
		controls.update();
		renderer.render(scene, camera);
	}
	animate();
}

init();
selectContainer();
selectObjects();
renderContainer();

console.log('done');

$('.nav-toggle').click(function (e) {
	$(this).toggleClass('open');
	$('.menu-container').toggleClass('nav-open');
});

//toggle button styles
$('.toggle').click(function () {
	$('.selected').removeClass('selected');
	$(this).addClass('selected');
});
