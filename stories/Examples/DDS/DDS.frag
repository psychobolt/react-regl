precision mediump float;
uniform sampler2D specular, normals, diffuse;
varying vec3 lightDir, eyeDir;
varying vec2 uv;

void main () {
  float d = length(lightDir);
  vec3 L = normalize(lightDir);
  vec3 E = normalize(eyeDir);
  vec3 N = normalize(2.0 * texture2D(normals, uv).rgb - 1.0);
  N = vec3(-N.x, N.yz);
  vec3 D = texture2D(diffuse, uv).rgb;
  vec3 kD = D * (0.01 + max(0.0, dot(L, N) * (0.6 + 0.8 / d)));
  vec3 S = texture2D(specular, uv).rgb;
  vec3 kS = 2.0 * pow(max(0.0, dot(normalize(N + L), -E)), 10.0) * S;
  gl_FragColor = vec4(kD + kS, 1);
}