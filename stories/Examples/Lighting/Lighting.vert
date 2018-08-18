precision mediump float;
attribute vec3 position, normal;
uniform mat4 view, projection;
varying vec3 fragNormal, fragPosition;

void main() {
  fragNormal = normal;
  fragPosition = position;
  gl_Position = projection * view * vec4(position, 1);
}