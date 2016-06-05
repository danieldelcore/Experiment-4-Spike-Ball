import THREE from 'three';

export default function calculateCentroid(vecticies = []) {
    const centeroid = new THREE.Vector3(0, 0, 0);
    const numPoints = vecticies.length;

    for (const point of vecticies) {
        centeroid.x += point.x;
        centeroid.y += point.y;
        centeroid.z += point.z;
    }

    centeroid.x /= numPoints;
    centeroid.y /= numPoints;
    centeroid.z /= numPoints;

    return centeroid;
}
