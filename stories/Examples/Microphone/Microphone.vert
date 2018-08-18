precision mediump float;

uniform int FFT_SIZE;
uniform float PI;

attribute float index, frequency;

void main() {
  float theta = 2.0 * PI * index / float(FFT_SIZE);
  gl_Position = vec4(
    0.5 * cos(theta) * (1.0 + frequency),
    0.5 * sin(theta) * (1.0 + frequency),
    0,
    1
  );
}
