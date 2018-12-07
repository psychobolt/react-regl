import mat4 from 'gl-mat4';

export function createModel(position, s) {
  const m = mat4.identity([]);
  mat4.translate(m, m, position);
  mat4.scale(m, m, [s, s, s]);
  return m;
}
