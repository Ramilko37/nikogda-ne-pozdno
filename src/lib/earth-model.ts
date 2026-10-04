/** Shared by the renderer and its HTML/static projection. No WebGL dependency. */
export const EARTH_VIEW = { latitude: 50, longitude: 90, distance: 3.8, fov: 32 };
export type Point3 = [number, number, number];
export function geographicPoint(latitude: number, longitude: number, radius = 1): Point3 {
  const lat = latitude * Math.PI / 180, lon = longitude * Math.PI / 180;
  // Three SphereGeometry UV: Greenwich = +X, east = -Z; north = +Y.
  return [radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat), -radius * Math.cos(lat) * Math.sin(lon)];
}
export const CAMERA_POSITION = geographicPoint(EARTH_VIEW.latitude, EARTH_VIEW.longitude, EARTH_VIEW.distance);
export const STAR_ANCHORS: Record<string, { latitude: number; longitude: number; height: number; phase: number }> = {
  help: { latitude: 69, longitude: 41, height: 0.13, phase: 0 },
  restart: { latitude: 75, longitude: 132, height: 0.13, phase: 1.7 },
  independent: { latitude: 61, longitude: 121, height: 0.13, phase: 3.4 },
  health: { latitude: 61, longitude: 79, height: 0.13, phase: 5.1 },
};
export function starPoint(id: string, time = 0): Point3 {
  const anchor = STAR_ANCHORS[id];
  const phase = time * 0.23 + anchor.phase;
  return geographicPoint(anchor.latitude + Math.sin(phase) * 0.65, anchor.longitude + Math.cos(phase * 0.8) * 0.8, 1 + anchor.height + Math.sin(phase * 1.2) * 0.012);
}
export function projectPoint(point: Point3, aspect = 1): [number, number] {
  const lat = EARTH_VIEW.latitude * Math.PI / 180, lon = EARTH_VIEW.longitude * Math.PI / 180;
  const normal = geographicPoint(EARTH_VIEW.latitude, EARTH_VIEW.longitude);
  const right = [-Math.sin(lon), 0, -Math.cos(lon)];
  const up = [-Math.sin(lat) * Math.cos(lon), Math.cos(lat), Math.sin(lat) * Math.sin(lon)];
  const dot = (a: number[], b: number[]) => a.reduce((sum, v, i) => sum + v * b[i], 0);
  const depth = EARTH_VIEW.distance - dot(point, normal);
  const scale = Math.tan(EARTH_VIEW.fov * Math.PI / 360) * depth;
  return [(dot(point, right) / scale / aspect + 1) * 50, (1 - dot(point, up) / scale) * 50];
}
