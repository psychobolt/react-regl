precision highp float;

uniform vec3 tint;
uniform samplerCube envMap;
varying vec3 eyeDir, fragNormal;

void main() {
  vec4 env = textureCube(envMap, reflect(-eyeDir, fragNormal));
  gl_FragColor = vec4(env.rgb * (normalize(fragNormal) + 0.8), 1);
}
