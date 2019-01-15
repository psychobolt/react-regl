precision mediump float;

// p0 and p1 are the two LOD arrays for this command
attribute vec3 p0, p1;
uniform float lod;

uniform mat4 view, projection;

varying vec3 fragColor;
void main() {
  vec3 position = mix(p0, p1, lod);
  fragColor = 0.5 + (0.2 * position);
  gl_Position = projection * view * vec4(position, 1);
}