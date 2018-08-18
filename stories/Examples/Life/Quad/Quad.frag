precision mediump float;
uniform sampler2D prevState;
varying vec2 uv;

void main() {
  float state = texture2D(prevState, uv).r;
  gl_FragColor = vec4(vec3(state), 1);
}
