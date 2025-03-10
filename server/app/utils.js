function generateUniqueUserId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

const direction_vector = {
  LEFT: [-1, 0], //
  RIGHT: [1, 0],
  DOWN: [0, 1],
};
export { generateUniqueUserId, direction_vector };
