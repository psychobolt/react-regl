precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D atlas;

void main() {
  vec3 lightDir = normalize(vec3(0.4, 0.9, 0.3));
  vec3 tex = texture2D(atlas, vUv).rgb;
  vec3 ambient = 0.3 * tex;
  vec3 diffuse = 0.7 * tex * clamp(dot(vNormal, lightDir), 0.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse, 1.0);
}
