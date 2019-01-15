precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 projection, view, model;
uniform bool isRound;

void main() {
  float s = 0.19;
  vec4 worldSpacePosition = model * vec4(
    // for objects with lots of jagged edges, the usual approach doesn't work.
    // We use an alternative way of enlarging the object for such objects.
    isRound ? (position + normal * s) : (position * (0.3 * s + 1.0)),
    1
  );
  gl_Position = projection * view * worldSpacePosition;
}
