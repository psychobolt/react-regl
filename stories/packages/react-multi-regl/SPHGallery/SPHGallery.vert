precision highp float;

attribute vec3 position;
uniform mat4 view, projection;
uniform vec3 color, degree, direction;
varying vec3 fragColor;

float sph() {
  vec3 s = position * degree;
  float theta = length(s);
  return 1.0 + cos(theta) * dot(s, normalize(direction));
}

void main() {
  fragColor = color + position;
  gl_Position = projection * view * vec4(sph() * position, 1);
}