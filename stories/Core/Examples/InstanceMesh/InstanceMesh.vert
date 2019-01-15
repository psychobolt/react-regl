precision mediump float;

attribute vec3 position;
attribute vec3 normal;

// These three are instanced attributes.
attribute vec3 offset;
attribute vec3 color;
attribute float angle;

uniform mat4 proj;
uniform mat4 model;
uniform mat4 view;

varying vec3 vNormal;
varying vec3 vColor;

void main() {
  vNormal = normal;
  vColor = color;

  gl_Position = proj * view * model * vec4(
    +cos(angle) * position.x + position.z * sin(angle) + offset.x,
    position.y + offset.y,
    -sin(angle) * position.x + position.z * cos(angle) + offset.z,
    1.0
  );
}
