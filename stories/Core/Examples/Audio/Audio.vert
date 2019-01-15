precision highp float;

attribute float N;
const vec4 WEIGHT1 = vec4(-1.0, 8.0, -8.0, 1.0);
const vec4 WEIGHT2 = vec4(-1.0, 16.0, 16.0, -1.0);

attribute vec2 vertId;

uniform float t;
uniform mat4 projection, view;
uniform vec3 lightPosition;
uniform float offsetRow;
uniform sampler2D terrain, color;

varying vec3 grad, fragColor, eyeDir, lightDir;
varying float curvature;

float f(vec2 x) {
  return 0.025 * pow(texture2D(terrain, x).r, 2.0) *
    (1.0 + 2.5 * pow(texture2D(color, vec2(x.y, 0.0)).a, 3.0));
}

vec4 stencil(vec2 x, vec2 d) {
  return vec4(
    f(x - 2.0 * d),
    f(x - d),
    f(x + d),
    f(x + 2.0 * d)
  );
}

void main() {
  vec2 uv = (vertId + vec2(0.0, offsetRow)) / N;

  float h0 = f(uv);
  vec4 hx = stencil(uv, vec2(1.0 / N, 0.0));
  vec4 hy = stencil(uv, vec2(0.0, 1.0 / N));

  grad = normalize(vec3(
    dot(WEIGHT1, hx),
    dot(WEIGHT1, hy),
    0.025
  ));

  curvature = max(
    max(
      dot(WEIGHT2, hx) - 30.0 * h0, 
      dot(WEIGHT2, hy) - 30.0 * h0
    ), 
    0.0
  );

  vec3 pos = vec3(vertId / N, h0 + 0.4);
  lightDir = lightPosition - pos;

  vec4 viewPos = view * vec4(pos, 1);
  gl_Position = projection * viewPos;
  eyeDir = viewPos.xyz / viewPos.w;

  vec3 audioColor = texture2D(color, vec2(uv.y, 0)).rgb;
  float minC = 0.9 * min(min(audioColor.r, audioColor.g), audioColor.b);
  float maxC = max(max(audioColor.r, audioColor.g), audioColor.b);
  fragColor = (audioColor - minC) / (maxC - minC);
}
