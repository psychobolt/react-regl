precision mediump float;

uniform sampler2D textureMap, normalMap;
uniform float normalScale, texScale;
uniform vec3 color, eye;

varying vec3 vNormal, v0Normal, vU;
varying vec4 vPosition, v0Position;

float random(vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

vec3 spherical_environment_map(vec3 ray, vec3 normal) {
  vec3 r = reflect(normalize(ray), normalize(normal));
  float m = 2.0 * sqrt(r.x + r.x + r.y + (r.z + 1.0) * (r.z + 1.0));
  vec2 calculatedNormal = vec2(r.x / m + 0.5, r.y / m + 0.5);
  return texture2D(textureMap, calculatedNormal).rgb;
}

mat3 tangent_space_basis(vec3 blend_weights) {
  vec3 tanX = vec3(vNormal.x, -vNormal.z, vNormal.y);
  vec3 tanY = vec3(vNormal.z, vNormal.y, -vNormal.x);
  vec3 tanZ = vec3(-vNormal.y, vNormal.x, vNormal.z);
  vec3 blended_tangent = tanX * blend_weights.xxx + tanY * blend_weights.yyy + tanZ * blend_weights.zzz;
  return mat3(
    normalize(blended_tangent),
    normalize(cross(vNormal, blended_tangent)),
    normalize(vNormal)
  );
}

vec3 blended_bump(vec3 blend_weights) {
  vec2 coord1 = vPosition.yz * texScale;
  vec2 coord2 = vPosition.zy * texScale;
  vec2 coord3 = vPosition.xy * texScale;

  vec3 bump1 = texture2D(normalMap, coord1).rgb;
  vec3 bump2 = texture2D(normalMap, coord2).rgb;
  vec3 bump3 = texture2D(normalMap, coord3).rgb;

  return bump1 * blend_weights.xxx + bump2 * blend_weights.yyy + bump3 * blend_weights.zzz;
}

void main() {
  // Using triplanar texturing, as in https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch01.html
  vec3 blend_weights = abs(normalize(v0Normal.xyz));
  blend_weights = (blend_weights - 0.2) * 7.0;
  blend_weights = max(blend_weights, 0.0);
  blend_weights /= (blend_weights.x + blend_weights.y + blend_weights.z);

  mat3 tsb = tangent_space_basis(blend_weights);
  vec3 bump = blended_bump(blend_weights);

  vec3 normalTex = bump * 2.0 - 1.0;
  normalTex.xy *= normalScale;
  normalTex.y *= -1.0;
  normalTex = normalize(normalTex);
  vec3 finalNormal = tsb * normalTex;
  vec3 base = spherical_environment_map(vU, finalNormal);

  float rim = 1.75 * max(0.0, abs(dot(normalize(vNormal), normalize(-v0Position.xyz))));
  base += 10.0 * base * color * clamp(1.0 - rim, 0.0, 0.15);

  base = vec3(1.0) - (vec3(1.0) - base) * (vec3(1.0) - base);

  float dither = 0.05 * random(vec3(1.0), length(gl_FragCoord));
  base += vec3(dither);

  gl_FragColor = vec4(base.rgb, 1.0);
}