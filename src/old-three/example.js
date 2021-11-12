import * as THREE from "three";
// import * as THREE from '../build/three.module.js';
import { MarchingCubes } from 'three-stdlib'
// import { MarchingCubes } from './jsm/objects/MarchingCubes.js';

let effect, resolution;

let effectController = {
    material: 'matte',
    speed: 0.1,
    numBlobs: 40,
    resolution: 100,
    isolation: 300,

    dummy: function () { }
}

let time = 0;

const clock = new THREE.Clock();

init();
render();

function init() {

    // MARCHING CUBES
    effect = new MarchingCubes(
        effectController.resolution,
        new THREE.MeshPhongMaterial({ specular: 0x111111, shininess: 1 }),
        true,
        true,
        100000
    );
    effect.position.set(0, 0, 0);
    effect.scale.set(700, 700, 700);
    effect.enableUvs = false;
    effect.enableColors = false;

    scene.add(effect);
}

// this controls content of marching cubes voxel field

function updateCubes(object, time) {

    object.reset();

    // fill the field with some metaballs
    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(effectController.numBlobs) - 1) / 4 + 1);

    for (let i = 0; i < effectController.numBlobs; i++) {
        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
        object.addBall(ballx, bally, ballz, strength, subtract);
    }
}

function render() {

    const delta = clock.getDelta();
    time += delta * effectController.speed * 0.5;

    // marching cubes

    effect.init(Math.floor(resolution));

    updateCubes(effect, time);
}
