precision highp float;

varying vec3 grad, fragColor, eyeDir, lightDir;
varying float curvature;

void main() {
  vec3 N = normalize(grad);
  vec3 V = normalize(eyeDir);
  vec3 L = normalize(lightDir);

  vec3 H = normalize(V + L);

  float ao = 1.0 - curvature;
  float diffuse = max(dot(L, N), 0.0);
  float fresnel = 0.1 + 0.5 * pow(1.0 - max(dot(H, V), 0.0), 5.0);
  float light = 0.25 * ao + 0.8 * diffuse + fresnel;
  gl_FragColor = vec4(light * fragColor, 1);
}
