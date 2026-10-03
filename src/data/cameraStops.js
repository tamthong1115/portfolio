// 4 Camera Stops according to docs/concept.md
export const CAMERA_STOPS = {
  hero: {
    pos: [0, 0.95, 3.7],
    target: [0, -0.2, 0],
  },
  about: {
    pos: [-1.15, 0.7, 2.3],
    target: [-0.1, 0.05, 0],
  },
  projects: {
    pos: [1.35, 1.45, 2.7],
    target: [-0.2, -0.15, -0.1],
  },
  contact: {
    pos: [0, 0.4, 3.5],
    target: [0, 0.15, 0],
  },
};

export default CAMERA_STOPS;
