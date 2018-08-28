precision mediump float;

uniform sampler2D envmap;
uniform float PI;

varying vec3 reflectDir;

vec4 lookupEnv (vec3 dir) {
  float lat = atan(dir.z, dir.x);
  float lon = acos(dir.y / length(dir));
  return texture2D(envmap, vec2(
    0.5 + lat / (2.0 * PI),
    lon / PI
  ));
}

void main() {
  gl_FragColor = lookupEnv(reflectDir);
}
