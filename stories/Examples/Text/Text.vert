attribute vec2 position;

uniform mat4 projection, view;

void main() {
  gl_Position = projection * view * vec4(position, 0, 1);
}