export const getPosition = N => Array(N).fill().map((_, i) => {
  const phi = 2 * Math.PI * (i / N);
  return [Math.cos(phi), Math.sin(phi)];
});
