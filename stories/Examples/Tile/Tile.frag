precision mediump float;

uniform sampler2D map, tiles;
uniform vec2 mapSize, tileSize;
varying vec2 uv;

void main() {
  vec2 tileCoord = floor(255.0 * texture2D(map, floor(uv) / mapSize).ra);
  gl_FragColor = texture2D(tiles, (tileCoord + fract(uv)) / tileSize);
}