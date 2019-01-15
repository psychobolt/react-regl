precision mediump float;

attribute vec3 position, normal;
uniform mat4 projection, view, invView;
varying vec3 reflectDir;

void main() {
  vec4 cameraPosition = view * vec4(position, 1);
  vec3 eye = normalize(position - invView[3].xyz / invView[3].w);
  reflectDir = reflect(eye, normal);
  gl_Position = projection * cameraPosition;
}
