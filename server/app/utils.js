function generateUniqueUserId() {
  return 'user-' + Math.random().toString(36).substr(2, 9);
}

const isValidName = (name) => {
  const regex = /^[a-zA-Z0-9_]{1,15}$/;
  return regex.test(name);
};

const direction_vector = {
  LEFT: [-1, 0], //
  RIGHT: [1, 0],
  DOWN: [0, 1],
};
export { generateUniqueUserId, direction_vector, isValidName };
