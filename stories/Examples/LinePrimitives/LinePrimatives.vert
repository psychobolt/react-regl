precision mediump float;
attribute vec2 position;

uniform mat4 projection, view;

uniform float scale;
uniform vec2 offset;
uniform float tick;
uniform float phase;
uniform float freq;

void main() {
  vec2 p = position;

  // scale
  p *= scale;

  // rotate
  float phi = tick * freq * phase;
  p = vec2(
    dot(vec2(+cos(phi), -sin(phi)), p),
    dot(vec2(+sin(phi), +cos(phi)), p)
  );

  // translate
  p += offset;

  gl_Position = projection * view * vec4(p, 0, 1);
}