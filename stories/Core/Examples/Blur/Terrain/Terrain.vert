// the size of the world on the x and z-axes.
#define WORLD_SIZE 300.0
// the height of the world.
#define WORLD_HEIGHT 100.0

uniform sampler2D heightTexture;

float getHeight(vec2 xz) {
  vec2 uv = vec2(0.5, 0.5) + xz.xy;
  return WORLD_HEIGHT * (-1.0 + 2.0 * texture2D(heightTexture, uv).r);
}

vec3 getPosition(vec2 xz) {
  return vec3(WORLD_SIZE * xz.x, getHeight(xz), WORLD_SIZE * xz.y);
}

precision mediump float;

attribute vec2 xzPosition;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

uniform mat4 projection, view;

void main() {
  vec3 xyzPosition = getPosition(xzPosition);
  
  vec2 uv = vec2(0.5, 0.5) + xzPosition.xy;
  vUv = uv;

  float eps = 1.0 / 16.0;

  // approximate the normal with central differences.
  vec3 va = vec3(2.0 * eps, getHeight(xzPosition + vec2(eps, 0.0)) - getHeight(xzPosition - vec2(eps, 0.0)), 0.0);
  vec3 vb = vec3(0.0, getHeight(xzPosition + vec2(0.0, eps)) - getHeight(xzPosition - vec2(0.0, eps)), 2.0 * eps);
  vNormal = normalize(cross(normalize(vb), normalize(va)));
  vPosition = xyzPosition;
  gl_Position = projection * view * vec4(xyzPosition, 1);
}