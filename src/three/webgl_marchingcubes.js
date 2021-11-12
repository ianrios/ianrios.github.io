import * as THREE from './three.module.js';

// import Stats from './jsm/libs/stats.module.js';

// import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from './OrbitControls.js';
import { MarchingCubes } from './MarchingCubes.js';

const IS_MOBILE =  /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

let container;
// , stats;

let camera, scene, renderer;

let materials, current_material;

let light, pointLight, ambientLight;

let effect
let resolution = IS_MOBILE ? 60 : 100;

let effectController = {

    material: 'matte',

    speed: 0.1,
    numBlobs: IS_MOBILE ? 10 : 30,
    resolution: IS_MOBILE ? 60 : 100,
    isolation: IS_MOBILE ? 250 : 400

};

let time = 0;

const clock = new THREE.Clock();

init();
animate();

export function init() {

    container = document.getElementById('three-container');

    // CAMERA

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-200, 500, 1500);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // LIGHTS

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    ambientLight = new THREE.AmbientLight(0x080808);
    scene.add(ambientLight);

    // MATERIALS

    materials = generateMaterials();
    current_material = 'matte';

    // MARCHING CUBES

    effect = new MarchingCubes(resolution, materials[current_material], true, true, 100000);
    effect.position.set(0, 0, 0);
    effect.scale.set(1400, 1400, 1400);

    effect.enableUvs = false;
    effect.enableColors = false;

    scene.add(effect);

    // RENDERER

    renderer = new THREE.WebGLRenderer();
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // CONTROLS

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 5000;

    // GUI

    setupGui();

    // EVENTS

    window.addEventListener('resize', onWindowResize);

}

//

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function generateMaterials() {

    // environment map

    // const path = 'textures/cube/SwedishRoyalCastle/';
    // const format = '.jpg';
    // const urls = [
    // 	path + 'px' + format, path + 'nx' + format,
    // 	path + 'py' + format, path + 'ny' + format,
    // 	path + 'pz' + format, path + 'nz' + format
    // ];

    // const cubeTextureLoader = new THREE.CubeTextureLoader();

    // const reflectionCube = cubeTextureLoader.load(urls);
    // const refractionCube = cubeTextureLoader.load(urls);
    // refractionCube.mapping = THREE.CubeRefractionMapping;

    // toons

    // const toonMaterial1 = createShaderMaterial(ToonShader1, light, ambientLight);
    // const toonMaterial2 = createShaderMaterial(ToonShader2, light, ambientLight);
    // const hatchingMaterial = createShaderMaterial(ToonShaderHatching, light, ambientLight);
    // const dottedMaterial = createShaderMaterial(ToonShaderDotted, light, ambientLight);

    // const texture = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg');
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    const materials = {
        // 'shiny': new THREE.MeshStandardMaterial({ color: 0x550000, envMap: reflectionCube, roughness: 0.1, metalness: 1.0 }),
        // 'chrome': new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: reflectionCube }),
        // 'liquid': new THREE.MeshLambertMaterial({ color: 0xffffff, envMap: refractionCube, refractionRatio: 0.85 }),
        'matte': new THREE.MeshPhongMaterial({ specular: 0x111111, shininess: 1 }),
        // 'flat': new THREE.MeshLambertMaterial({ /*TODO flatShading: true */ }),
        // 'textured': new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x111111, shininess: 1, map: texture }),
        // 'colors': new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 2, vertexColors: true }),
        // 'multiColors': new THREE.MeshPhongMaterial({ shininess: 2, vertexColors: true }),
        // 'plastic': new THREE.MeshPhongMaterial({ specular: 0x888888, shininess: 250 }),
        // 'toon1': toonMaterial1,
        // 'toon2': toonMaterial2,
        // 'hatching': hatchingMaterial,
        // 'dotted': dottedMaterial
    };

    return materials;

}

//

function setupGui() {

    const createHandler = function (id) {

        return function () {

            current_material = id;

            effect.material = materials[id];
            effect.enableUvs = (current_material === 'textured') ? true : false;
            effect.enableColors = (current_material === 'colors' || current_material === 'multiColors') ? true : false;

        };

    };



    // let h;

    // const gui = new GUI();

    // material (type)

    // h = gui.addFolder( 'Materials' );

    // for ( const m in materials ) {

    // 	effectController[ m ] = createHandler( m );
    // 	h.add( effectController, m ).name( m );

    // }

    // simulation

    // h = gui.addFolder( 'Simulation' );

    // h.add( effectController, 'speed', 0.1, 8.0, 0.05 );
    // h.add( effectController, 'numBlobs', 1, 50, 1 );
    // h.add( effectController, 'resolution', 14, 100, 1 );
    // h.add( effectController, 'isolation', 10, 300, 1 );

}

// this controls content of marching cubes voxel field

function updateCubes(object, time, numblobs) {

    object.reset();

    // fill the field with some metaballs

    const rainbow = [
        new THREE.Color(0xff0000),
        new THREE.Color(0xff7f00),
        new THREE.Color(0xffff00),
        new THREE.Color(0x00ff00),
        new THREE.Color(0x0000ff),
        new THREE.Color(0x4b0082),
        new THREE.Color(0x9400d3)
    ];
    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

        if (current_material === 'multiColors') {

            object.addBall(ballx, bally, ballz, strength, subtract, rainbow[i % 7]);

        } else {

            object.addBall(ballx, bally, ballz, strength, subtract);

        }

    }

    // if ( floor ) object.addPlaneY( 2, 12 );
    // if ( wallz ) object.addPlaneZ( 2, 12 );
    // if ( wallx ) object.addPlaneX( 2, 12 );

}

//

export function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    const delta = clock.getDelta();

    time += delta * effectController.speed * 0.5;

    // marching cubes

    if (effectController.resolution !== resolution) {

        resolution = effectController.resolution;
        effect.init(Math.floor(resolution));

    }

    if (effectController.isolation !== effect.isolation) {

        effect.isolation = effectController.isolation;

    }

    updateCubes(effect, time, effectController.numBlobs);

    // render

    renderer.render(scene, camera);

}



export async function main(canvas) {
    //...Do ThreeJS stuff
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas, // 👈 Use canvas as the ThreeJS canvas
    });

    // 👇 Use canavs dimentions insted of window
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // function render() {...} //...Render loop without requestAnimationFrame()
    function cleanup() {} //...Any cleanup youd like (optional)

    return { render, cleanup }
}