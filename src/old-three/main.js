import * as THREE from "three";
import { MarchingCubes, OrbitControls } from 'three-stdlib'

// import Stats from './jsm/libs/stats.module.js';

// import { GUI } from './jsm/libs/dat.gui.module.js';
// import { OrbitControls } from './jsm/controls/OrbitControls.js';
// import { MarchingCubes } from './jsm/objects/MarchingCubes.js';
// import { ToonShader1, ToonShader2, ToonShaderHatching, ToonShaderDotted } from './jsm/shaders/ToonShader.js';



let container = document.getElementById('three-container');
// let stats;

let camera, scene, renderer;

let light, pointLight, ambientLight;

let effect;

let effectController = {
    material: new THREE.MeshPhongMaterial({ specular: 0x111111, shininess: 1 }),
    speed: 0.1,
    numBlobs: 40,
    resolution: 100,
    isolation: 300,

    dummy: function () { }
}

let time = 0;

const clock = new THREE.Clock();

init();
animate();

export async function main(canvas) {
    //...Do ThreeJS stuff
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas, // 👈 Use canvas as the ThreeJS canvas
    });

    // 👇 Use canavs dimentions insted of window
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // function render() { } //...Render loop without requestAnimationFrame()
    function cleanup() { } //...Any cleanup youd like (optional)

    return { render, cleanup }
}











function init() {

    // CAMERA

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(- 500, 500, 1500);

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

    // materials = generateMaterials();
    // current_material = 'shiny';

    // MARCHING CUBES



    effect = new MarchingCubes(effectController.resolution, effectController.material, true, true, 100000);
    effect.position = [0, 0, 0];
    // effect.scale.set(700, 700, 700);

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

    // STATS

    // stats = new Stats();
    // container.appendChild(stats.dom);

    // // GUI

    // setupGui();

    // EVENTS

    window.addEventListener('resize', onWindowResize);

}

//

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


//

// function setupGui() {

//     // const createHandler = function (id) {

//     //     return function () {

//     //         current_material = id;

//     //         effect.material = materials[id];
//     //         effect.enableUvs = (current_material === 'textured') ? true : false;
//     //         effect.enableColors = (current_material === 'colors' || current_material === 'multiColors') ? true : false;

//     //     };

//     // };

//     // effectController = {

//     //     material: 'shiny',

//     //     speed: 1.0,
//     //     numBlobs: 10,
//     //     resolution: 28,
//     //     isolation: 80,

//     //     floor: true,
//     //     wallx: false,
//     //     wallz: false,

//     //     dummy: function () { }

//     // };

//     // let h;

//     // const gui = new GUI();

//     // // material (type)

//     // h = gui.addFolder('Materials');

//     // for (const m in materials) {

//     //     effectController[m] = createHandler(m);
//     //     h.add(effectController, m).name(m);

//     // }

//     // // simulation

//     // h = gui.addFolder('Simulation');

//     // h.add(effectController, 'speed', 0.1, 8.0, 0.05);
//     // h.add(effectController, 'numBlobs', 1, 50, 1);
//     // h.add(effectController, 'resolution', 14, 100, 1);
//     // h.add(effectController, 'isolation', 10, 300, 1);

//     // h.add(effectController, 'floor');
//     // h.add(effectController, 'wallx');
//     // h.add(effectController, 'wallz');

// }

// this controls content of marching cubes voxel field

function updateCubes(object, time,
    // numblobs, 
    // floor, wallx, wallz
) {
    let numblobs = effectController.numBlobs

    object.reset();

    // fill the field with some metaballs

    // const rainbow = [
    //     new THREE.Color(0xff0000),
    //     new THREE.Color(0xff7f00),
    //     new THREE.Color(0xffff00),
    //     new THREE.Color(0x00ff00),
    //     new THREE.Color(0x0000ff),
    //     new THREE.Color(0x4b0082),
    //     new THREE.Color(0x9400d3)
    // ];
    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;

        object.addBall(ballx, bally, ballz, strength, subtract);
        // if (current_material === 'multiColors') {

        //     object.addBall(ballx, bally, ballz, strength, subtract, rainbow[i % 7]);

        // } else {

        //     object.addBall(ballx, bally, ballz, strength, subtract);

        // }

    }

    // if (floor) object.addPlaneY(2, 12);
    // if (wallz) object.addPlaneZ(2, 12);
    // if (wallx) object.addPlaneX(2, 12);

}

//

function animate() {

    // requestAnimationFrame( animate );

    render();
    // stats.update();

}

function render() {

    const delta = clock.getDelta();

    time += delta * effectController.speed * 0.5;

    // marching cubes

    effect.init(Math.floor(effectController.resolution));
    // if ( effectController.resolution !== resolution ) {

    // 	resolution = effectController.resolution;

    // }

    // if ( effectController.isolation !== effect.isolation ) {

    // 	effect.isolation = effectController.isolation;

    // }

    updateCubes(effect, time,
        //  effectController.numBlobs,
        // effectController.floor, effectController.wallx, effectController.wallz 
    );

    // render

    renderer.render(scene, camera);

}
