import THREE from 'three';
import explodeModifier from './explodeModifier';

export default class SpikeBall {
    constructor(gui) {
        this.config = {
            speed: 800,
            radius: 400,
            detail: 4,
            min: 350,
            max: 300,
        };

        const geometry = new THREE.IcosahedronGeometry(
            this.config.radius,
            this.config.detail);

        this.geometry = explodeModifier(geometry);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 1,
            shading: THREE.SmoothShading,
            // shading: THREE.FlatShading,
            // side: THREE.DoubleSide,
            // wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        this.initGui(gui);
    }

    initGui(gui) {
        const folder = gui.addFolder('Sphere');
        folder.add(this.config, 'min', 0, 400);
        folder.add(this.config, 'max', 0, 800);
        folder.add(this.config, 'speed', 1, 1000);
    }

    getArcLength(fromVec, toVec) {
        const angle = Math.atan2(toVec.y - fromVec.y, toVec.x - fromVec.x);
        return this.config.radius * angle;
    }

    update(timeStamp) {
        const { speed, min, max } = this.config;
        const vertices = this.mesh.geometry.vertices;

        for (let i = 0; i < vertices.length; i += 4) {
            const wave = min + Math.abs((Math.sin(i + (timeStamp / speed))) * max);
            const D = vertices[i + 3];
            D.normalize().multiplyScalar(wave);
        }

        this.mesh.rotation.y += 0.001;
        this.mesh.rotation.x += 0.003;
        this.mesh.rotation.z += 0.002;

        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
