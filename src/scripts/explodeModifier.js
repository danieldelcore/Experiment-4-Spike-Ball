/**
 * This file has been altered for the tutorial.
 * Find the original here: http://threejs.org/examples/js/modifiers/ExplodeModifier.js
 */

import THREE from 'three';
import calculateCentroid from './utils/centeroid';

export default function explodeModifier(geometry) {
    const vertices = [];
    const faces = [];
    const uv = [];
    const g = geometry;

    for (let i = 0, il = geometry.faces.length; i < il; i++) {
        const n = vertices.length;
        const face = g.faces[i];
        const { a, b, c } = face;

        const va = g.vertices[a];
        const vb = g.vertices[b];
        const vc = g.vertices[c];
        const vd = calculateCentroid([va, vb, vc]);

        vertices.push(va.clone(), vb.clone(), vc.clone(), vd);

        face.a = n;
        face.b = n + 1;
        face.c = n + 2;

        // add other faces connect them to our newly created vector
        const face1 = new THREE.Face3().copy(face);
        face1.a = n + 3;
        const face2 = new THREE.Face3().copy(face);
        face2.b = n + 3;
        const face3 = new THREE.Face3().copy(face);
        face3.c = n + 3;

        faces.push(face1, face2, face3);

        // adds uvs to avoid uv error
        const vuv = [];
        vuv.push(
            g.faceVertexUvs[0][i][0],
            g.faceVertexUvs[0][i][1],
            g.faceVertexUvs[0][i][2]);

        // extra uvs per extra face
        uv.push(vuv, vuv, vuv);
    }

    g.vertices = vertices;
    g.vertices[vertices.length - 1] = new THREE.Vector3(0, 0, 0);
    g.faces = faces;
    g.faceVertexUvs[0] = uv;
    return g;
}
