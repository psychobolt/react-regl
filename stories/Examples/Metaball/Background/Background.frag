precision mediump float;

uniform vec3 color;
uniform float noise, width, height;

#define VIG_REDUCTION_POWER 1.0
#define VIG_BOOST 1.0

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main () {
  vec2 resolution = vec2(width, height);
  vec2 center = resolution * 0.5;
  float vignette = distance(center, gl_FragCoord.xy) / resolution.x;
  vignette = VIG_BOOST - vignette * VIG_REDUCTION_POWER;

  float n = noise * (0.5 - random(vec3(1.0), length(gl_FragCoord)));

  float v = 0.5 * length(vec2(gl_FragCoord.y / resolution.y, 1.0 - abs(0.5 - gl_FragCoord.x / resolution.x)));
  vec3 base = color;
  base += vec3(pow(v, 2.0));

  gl_FragColor = vec4(base * vec3(vignette) + vec3(n), 1.0);
}