uniform vec2 mouse;

#define MOUSE_SIZE 32.0

attribute float p;

void main() {
  gl_PointSize = MOUSE_SIZE;
  gl_Position = vec4(mouse, p, 1);
}
