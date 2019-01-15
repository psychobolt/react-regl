precision mediump float;
varying vec2 uv;
uniform sampler2D albedoTex, normalTex;

uniform vec3 ambientLight;
uniform vec3 diffuseLight;
uniform vec3 lightDir;

void main() {
  vec3 albedo = texture2D(albedoTex, uv).xyz;
  vec3 n = texture2D(normalTex, uv).xyz;

  vec3 ambient = ambientLight * albedo;
  vec3 diffuse = diffuseLight * albedo * clamp(dot(n, lightDir), 0.0, 1.0);

  gl_FragColor = vec4(ambient + diffuse, 1.0);
}
