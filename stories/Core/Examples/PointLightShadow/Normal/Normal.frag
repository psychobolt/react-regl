precision mediump float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform float ambientLightAmount;
uniform float diffuseLightAmount;
uniform vec3 color;
uniform vec3 lightPos;
uniform samplerCube shadowCube;

void main() {
  // do ambient and diffuse lighting.
  vec3 lightDir = normalize(lightPos - vPosition);
  vec3 ambient = ambientLightAmount * color;
  float cosTheta = dot(vNormal, lightDir);
  vec3 diffuse = diffuseLightAmount * color * clamp(cosTheta, 0.0, 1.0);

  vec3 texCoord = (vPosition - lightPos);
  float visibility = 0.0;

  // do soft shadows:
  for (int x = 0; x < 2; x++) {
    for (int y = 0; y < 2; y++) {
      for (int z = 0; z < 2; z++) {
        float bias = 0.3;
        vec4 env = textureCube(shadowCube, texCoord + vec3(x, y, z) * vec3(0.1));
        visibility += (env.x + bias) < (distance(vPosition, lightPos)) ? 0.0 : 1.0;
      }
    }
  }
  visibility *= 1.0 / 8.0;

  gl_FragColor = vec4((ambient * visibility + diffuse), 1.0);
}