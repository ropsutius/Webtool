import { weftColor, warpColor } from './Materials.js';
import * as THREEf from './utilities/THREEf.module.js';

export const weftLength = 2;
export const warpLength = 4;
export const warpOffset = 4;
export const warpPoints = [
  0,
  warpLength / 4,
  warpLength / 2,
  (3 * warpLength) / 4,
  warpLength,
];
export const tubeRadius = 1;
export const tubeSegments = 32;
export const tubeRadialSegments = 8;
export const layerOffset = 5;
export const pixelSize = 10;
export const lineWidth = 1;

export function getTubeFromCurve(curve, type) {
  if (!curve) {
    curve = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
    type = 'Warp';
  }

  const tubeGeometry = new THREE.TubeBufferGeometry(
    new THREE.CatmullRomCurve3(curve),
    tubeSegments,
    tubeRadius,
    tubeRadialSegments,
    false
  );

  const color = type === 'Weft' ? weftColor : warpColor;
  const tubeMaterial = new THREE.MeshLambertMaterial({ color: color });
  const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

  tube.name = type;

  return tube;
}

export function updateTube(tube, curve) {
  if (tube && curve) {
    tube.geometry.copy(
      new THREE.TubeBufferGeometry(
        new THREE.CatmullRomCurve3(curve),
        tubeSegments,
        tubeRadius,
        tubeRadialSegments,
        false
      )
    );
    tube.geometry.needsUpdate = true;
  }
}
