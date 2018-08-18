precision mediump float;
struct Light {
  vec3 color;
  vec3 position;
};
uniform Light lights[4];
varying vec3 fragNormal, fragPosition;

void main() {
  vec3 normal = normalize(fragNormal);
  vec3 light = vec3(0, 0, 0);
  for (int i = 0; i < 4; ++i) {
    vec3 lightDir = normalize(lights[i].position - fragPosition);
    float diffuse = max(0.0, dot(lightDir, normal));
    light += diffuse * lights[i].color;
  }
  gl_FragColor = vec4(light, 1);
}