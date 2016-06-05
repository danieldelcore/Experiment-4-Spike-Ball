/**
 * This file has been altered for the tutorial.
 * Find the original here: http://threejs.org/examples/js/modifiers/ExplodeModifier.js
 */

/**
 * Make all faces use unique vertices
 * so that each face can be separated from others
 *
 * @author alteredq / http://alteredqualia.com/
 */

import THREE from 'three';
import calculateCentroid from './utils/centeroid';

export default function explodeModifier(geometry) {
    const vertices = [];
    const faces = [];
    const uv = [];
    const facesLen = geometry.faces.length;

    for (let i = 1; i < facesLen; i++) {
        const n = vertices.length;
        const face = geometry.faces[i];
        const { a, b, c } = face;

        const va = geometry.vertices[a];
        const vb = geometry.vertices[b];
        const vc = geometry.vertices[c];
        const vd = calculateCentroid([va, vb, vc]);

        vertices.push(va.clone());
        vertices.push(vb.clone());
        vertices.push(vc.clone());
        vertices.push(vd);

        face.a = n;
        face.b = n + 1;
        face.c = n + 2;

        // faces.push(face.clone());

        // add other faces
        const centerVectorIndex = geometry.faces.length * 4 - 1;
        const extraFace1 = new THREE.Face3().copy(face);
        extraFace1.a = centerVectorIndex;
        const extraFace2 = new THREE.Face3().copy(face);
        extraFace2.b = centerVectorIndex;
        const extraFace3 = new THREE.Face3().copy(face);
        extraFace3.c = centerVectorIndex;

        const extraFace4 = new THREE.Face3().copy(face);
        extraFace4.a = i * 4 - 1;
        const extraFace5 = new THREE.Face3().copy(face);
        extraFace5.b = i * 4 - 1;
        const extraFace6 = new THREE.Face3().copy(face);
        extraFace6.c = i * 4 - 1;

        faces.push(extraFace1,
            extraFace2,
            extraFace3,
            extraFace4,
            extraFace5,
            extraFace6
        );


        // // adds uvs to avoid uv error
        // const vuv = [];
        // vuv.push(new THREE.Vector2().copy(geometry.faceVertexUvs[0][i][0]));
        // vuv.push(new THREE.Vector2().copy(geometry.faceVertexUvs[0][i][1]));
        // vuv.push(new THREE.Vector2().copy(geometry.faceVertexUvs[0][i][2]));
        // vuv.push(new THREE.Vector2().copy(geometry.faceVertexUvs[0][i][3]));
        //
        // // extra uvs per extra face
        // uv.push(vuv);
    }

    const newGeom = geometry;
    newGeom.vertices = vertices;
    newGeom.vertices[vertices.length - 1] = new THREE.Vector3(0, 0, 0);
    newGeom.faces = faces;
    newGeom.faceVertexUvs[0] = uv;
    return newGeom;
}
