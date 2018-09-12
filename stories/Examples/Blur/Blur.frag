precision mediump float;

varying vec2 uv;
uniform sampler2D tex;
uniform float wRcp, hRcp;

// increase and decrease the blur amount by modifying this value.
#define R 1

void main() {
  float W = float((1 + 2 * R) * (1 + 2 * R));
  
  vec3 avg = vec3(0.0);
  for (int x = -R; x <= +R; x++) {
    for (int y = -R; y <= +R; y++) {
      avg += (1.0 / W) * texture2D(tex, uv + vec2(float(x) * wRcp, float(y) * hRcp)).xyz;
    }
  }

  gl_FragColor = vec4(avg, 1.0);
}
