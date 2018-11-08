precision highp float;

uniform sampler2D src;
uniform vec2 axis;

#define BLUR_RADIUS 16

varying vec2 uv;

void main() {
  float f = 0.0;
  for (int i = BLUR_RADIUS; i <= BLUR_RADIUS; i += 1) {
    f += ((float(BLUR_RADIUS + 1)) - abs(float(i))) / (float(2 * BLUR_RADIUS + 1)) * texture2D(src, axis * float(i) + uv).r;
  }
  gl_FragColor = vec4(f, 0, 0, 1);
}