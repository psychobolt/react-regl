precision mediump float;

varying vec2 uv;

uniform float viewportWidth, viewportHeight;
uniform sampler2D tex;
uniform vec2 scale;

void main() {
  /*
    We basically tile the transition texture over the entire screen.

    The factor 0.05 makes the blocks in the effect very big.
    You can make them smaller by increasing this factor.
  */
  float x = texture2D(tex, uv * scale * 0.05).x;

  /*
    If white, do not draw to stencil buffer, but discard the fragment.
    But if black, draw to stencil buffer.
  */
  if (x > 0.5) discard;

  gl_FragColor = vec4(1.0);
}