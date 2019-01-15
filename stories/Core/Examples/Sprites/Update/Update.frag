precision highp float;

uniform sampler2D state;
uniform float shapeX, shapeY, deltaT, gravity;

void main() {
  vec2 shape = vec2(shapeX, shapeY);
  vec4 prevState = texture2D(state, gl_FragCoord.xy / shape);

  vec2 position = prevState.xy;
  vec2 velocity = prevState.zw;

  position += 0.5 * velocity * deltaT;
  if (position.x < -1.0 || position.x > 1.0) {
    velocity.x *= -1.0;
  }
  if (position.y < -1.0 || position.y > 1.0) {
    velocity.y *= -1.0;
  }
  position += 0.5 * velocity * deltaT;
  velocity.y = velocity.y + gravity * deltaT;

  gl_FragColor = vec4(position, velocity);
}