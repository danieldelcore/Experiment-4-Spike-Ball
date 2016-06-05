import THREE from 'three';
import explodeModifier from './explodeModifier';

export default class Blob {
    constructor(gui) {
        this.config = {
            size: 80,
            speed: 500,
            radius: 400,
            detail: 2,
        };

        const geometry = new THREE.IcosahedronGeometry(
            this.config.radius,
            this.config.detail);

        this.geometry = explodeModifier(geometry);

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            // wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);
        this.warpVector = new THREE.Vector3(0, 200, 0);
        this.initGui(gui);

        const { speed, radius } = this.config;
        for (let i = 0; i < this.mesh.geometry.vertices.length; i += 4) {
            const A = this.mesh.geometry.vertices[i + 0];
            const B = this.mesh.geometry.vertices[i + 1];
            const C = this.mesh.geometry.vertices[i + 2];
            const D = this.mesh.geometry.vertices[i + 3];
            const scale = 1 + 0.5 * (radius * 2);
            A.normalize().multiplyScalar(scale);
            B.normalize().multiplyScalar(scale);
            C.normalize().multiplyScalar(scale);
            D.normalize().multiplyScalar(radius - 50);
            // D.normalize().multiplyScalar(radius / 2); // animate between 0 and radius * 2
        }


    }

    initGui(gui) {
        const folder = gui.addFolder('Sphere');
        folder.add(this.config, 'size', 80, 200)
            .onChange(c => this.config.size = Number(c));
        folder.add(this.config, 'speed', 1, 1000);
    }

    getArcLength(fromVec, toVec) {
        const angle = Math.atan2(toVec.y - fromVec.y, toVec.x - fromVec.x);
        return this.config.radius * angle;
    }

    update(timeStamp) {
        // const { speed, radius } = this.config;
        // for (let i = 0; i < this.mesh.geometry.vertices.length; i += 4) {
        //     // const A = this.mesh.geometry.vertices[i + 0];
        //     // const B = this.mesh.geometry.vertices[i + 1];
        //     // const C = this.mesh.geometry.vertices[i + 2];
        //     const D = this.mesh.geometry.vertices[i + 3];
        //
        //     const radian = radius * (Math.sin((timeStamp / (speed * 8))));
        //     // console.log(radian);
        //     // A.normalize().multiplyScalar(scale);
        //     // B.normalize().multiplyScalar(scale);
        //     // C.normalize().multiplyScalar(scale);
        //     D.normalize().multiplyScalar(radian);
        // }
        // // this.mesh.geometry.computeVertexNormals();
        // // this.mesh.geometry.computeFaceNormals();
        // this.mesh.geometry.verticesNeedUpdate = true;
        // // this.mesh.geometry.elementsNeedUpdate = true;
        // // this.mesh.geometry.normalsNeedUpdate = true;
    }
}
