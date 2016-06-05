/* globals Detector */
/* eslint-disable no-param-reassign */

import THREE from 'three';
import dat from 'dat-gui';
import Blob from './blob';
import bindAll from 'lodash/bindAll';

const gui = new dat.GUI();

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = '';
}

function initGui(main) {
    // Lights
    const folder = gui.addFolder('Light');
    folder.addColor(main.conf, 'hemisphereLightColor')
        .onChange(c => main.hemisphereLight.color = new THREE.Color(c));
    folder.addColor(main.conf, 'hemisphereLightColor2')
        .onChange(c => main.hemisphereLight.groundColor = new THREE.Color(c));
    folder.add(main.conf, 'hemisphereLightIntensity', 0, 10)
        .onChange(c => main.hemisphereLight.intensity = c);
    folder.addColor(main.conf, 'directionalLightColor')
        .onChange(c => main.directionalLight.color = new THREE.Color(c));
    folder.add(main.conf, 'directionalLightIntensity', 0, 10)
        .onChange(c => main.directionalLight.intensity = c);
}

class Main {
    constructor() {
        bindAll(this,
            'animate',
            'onResize');

        this.conf = {
            hemisphereLightColor: 0xe9ff4a,
            hemisphereLightColor2: 0x0bd318,
            hemisphereLightIntensity: 0,
            directionalLightColor: 0xffffff,
            directionalLightIntensity: 0,
        };

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setClearColor(0x17293a);

        // Container
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);

        // Scene
        this.scene = new THREE.Scene();
        window.addEventListener('resize', this.onResize);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            10000);
        this.camera.position.set(0, 0, 1500);
        this.camera.lookAt(0, 0, 0);

        // Controls
        this.controls = new THREE.OrbitControls(
            this.camera,
            this.renderer.domElement);
        this.controls.userPan = false;
        this.controls.userPanSpeed = 0.0;
        this.controls.maxDistance = 5000.0;
        this.controls.target.set(0, 0, 0);

        // Light
        this.directionalLight = new THREE.DirectionalLight(
            this.conf.directionalLightColor,
            this.conf.directionalLightIntensity);
        this.directionalLight.position.set(-100, 20, 30);
        this.hemisphereLight = new THREE.HemisphereLight(
            this.conf.hemisphereLightColor,
            this.conf.hemisphereLightColor2,
            this.conf.hemisphereLightIntensity);
        this.hemisphereLight.position.set(-20, 20, 30);

        const light = new THREE.PointLight(0xffffff);
        light.position.set(0, 1000, 1000);
        this.scene.add(light);

        const light1 = new THREE.PointLight(0xffffff);
        light1.position.set(0, -1000, 1000);
        this.scene.add(light1);

        // Pièce de résistance
        this.blob = new Blob(gui);

        this.scene.add(
            this.hemisphereLight,
            this.directionalLight,
            this.blob.mesh);
    }

    onResize() {
        const { innerWidth, innerHeight } = window;
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render(timeStamp) {
        if (timeStamp) this.blob.update(timeStamp);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    animate(timeStamp) {
        requestAnimationFrame(this.animate);
        this.render(timeStamp);
    }
}

const main = new Main();
main.animate();
initGui(main);
