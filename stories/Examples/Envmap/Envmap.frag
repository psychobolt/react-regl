precision mediump float;

uniform samplerCube envmap;
varying vec3 reflectDir;

void main() {
  gl_FragColor = textureCube(envmap, reflectDir);
}