precision mediump float;

attribute vec3 position, normal;
uniform vec3 lightDir;
uniform mat4 camera;
uniform mat4 model;

/*
  The below vertex shader needs some explaining:

  We define dark cap and light cap as in figure 9-6 of this article:
  https://developer.nvidia.com/gpugems/GPUGems/gpugems_ch09.html

  Firstly, drawing the light cap is easy, because we can just draw the rabbit mesh as usual. See figure 9-6, and you should understand.

  Secondly. However, we have the dark cap. Basically, to create the dark cap, we need to project the mesh onto infinity, in the direction
  of the light. And infinity, in the case of OpenGL, is just the faces of the clip-volume. The clip-volume is just a cube, and everything
  outside of this cube, is simply not drawn by OpenGL.

  So to project something to infinity, we need to project it onto one of the faces of this cube. The face we project onto depends on the
  light direction, and what we are doing in the function 'extend', is that we are finding which face to project upon, and then we project
  the vertex of the mesh onto the face, thus creating the dark cap.
*/

vec4 extend(vec3 p) {
  vec4 tlightDir = camera * vec4(lightDir, 0);
  vec3 light = normalize(tlightDir.xyz);
  vec3 dpos = (1.0 - p) / light;
  vec3 dneg = (vec3(-1.0, -1.0, 0.0) - p) / light;
  vec3 dt = mix(dneg, dpos, step(0.0, light));
  return vec4(0.999 * min(min(dt.x, dt.y), dt.z) * light + p, 0);
}

void main() {
  vec4 projected = camera * model * vec4(position, 1);
  if (dot(normal, lightDir) <= 0.0) {
    // light cap
    gl_Position = projected;
  } else {
    // dark cap
    gl_Position = extend(projected.xyz / projected.w);
  }
}
