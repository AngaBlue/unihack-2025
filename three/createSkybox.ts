import * as THREE from 'three';


function getStarfield(size = 0.35, count = 1000) {
	const geo = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	const colors = new Float32Array(count * 3);
	
	for (let i = 0; i < count; i++) {
	  const radius = Math.random() * 250 + 250;
	  const theta = Math.random() * Math.PI * 2;
	  const phi = Math.acos((Math.random() * 2) - 1);
  
	  const x = radius * Math.sin(phi) * Math.cos(theta);
	  const y = radius * Math.sin(phi) * Math.sin(theta);
	  const z = radius * Math.cos(phi);
  
	  positions.set([x, y, z], i * 3);
	  
	  const t = Math.random();
	  const color = new THREE.Color(
		0.5 * t, 
		1 - t,   
		1        
	  );
  
	  colors.set([color.r, color.g, color.b], i * 3);
	}
  
	geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  
	const mat = new THREE.PointsMaterial({
		size: size * 10,
		vertexColors: true,
		transparent: true,
		depthTest: true, 
		depthWrite: true, 
		blending: THREE.AdditiveBlending,
		map: new THREE.TextureLoader().load("/images/circle.png"),
	  });
  
	return new THREE.Points(geo, mat);
  }
  


const loader = new THREE.TextureLoader();

function getSprite( color: any, opacity: any, pos: any, size: any) {
  const spriteMat = new THREE.SpriteMaterial({
    color,
    map: loader.load("/images/rad-grad.png"),
    transparent: true,
    opacity,
  });
  spriteMat.color.offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
  const sprite = new THREE.Sprite(spriteMat);
  sprite.position.set(pos.x, -pos.y, pos.z);
  size += Math.random() - 0.5;
  sprite.scale.set(size, size, size);
  sprite.material.rotation = 0;
  return sprite;
}

function getNebula({
	numSprites = 15, 
	opacity = 0.7, 
	radius = 10000, 
	size = 2000,    
	z = 0,
}) {
	const layerGroup = new THREE.Group();

	for (let i = 0; i < numSprites; i += 1) {
		let angle = (i / numSprites) * Math.PI * 2;
		const pos = new THREE.Vector3(
			Math.cos(angle) * Math.random() * radius,
			Math.sin(angle) * Math.random() * radius,
			z + Math.random() * 500 
		);

		// blend pink green and purple 
		const t1 = Math.random();
		const t2 = Math.random();
		const r = (1 - t1) * 1.0 + t1 * (t2 < 0.5 ? 0.6 : 0.4); 
		const g = (1 - t1) * 0.4 + t1 * (t2 < 0.5 ? 1.0 : 0.4);
		const b = (1 - t1) * 0.7 + t1 * (t2 < 0.5 ? 0.6 : 1.0); 

		let color = new THREE.Color(r, g, b);
		const sprite = getSprite(color, opacity, pos, size);
		layerGroup.add(sprite);
	}

	return layerGroup;
}

/**
 * Creates the skybox mesh.
 * @returns Skybox mesh.
 */
export default function createSkybox() {
	
	const texture_ft = new THREE.TextureLoader().load('/space_ft.png');
	const texture_bk = new THREE.TextureLoader().load('/space_bk.png');
	const texture_up = new THREE.TextureLoader().load('/space_up.png');
	const texture_dn = new THREE.TextureLoader().load('/space_dn.png');
	const texture_rt = new THREE.TextureLoader().load('/space_rt.png');
	const texture_lf = new THREE.TextureLoader().load('/space_lf.png');

	// Textures
	const textures = [
		new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
		new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide })
	];

	const geometry = new THREE.BoxGeometry(10000, 10000, 10000);
	const mesh = new THREE.Mesh(geometry, textures);
	

	const nebula = getNebula({}); // Default parameters adjusted


	const starfield = getStarfield();
	return [starfield, mesh, nebula];


	// return mesh;
}
