// Vertex shader from https://mattdesl.svbtle.com/drawing-lines-is-hard
// The MIT License (MIT) Copyright (c) 2015 Matt DewsLauriers
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float aspect;

uniform float thickness;
uniform int miter;

attribute vec3 prevPosition;
attribute vec3 currPosition;
attribute vec3 nextPosition;
attribute float offsetScale;

void main() {
  vec2 aspectVec = vec2(aspect, 1.0);
  mat4 projViewModel = projection * view * model;
  vec4 prevProjected = projViewModel * vec4(prevPosition, 1.0);
  vec4 currProjected = projViewModel * vec4(currPosition, 1.0);
  vec4 nextProjected = projViewModel * vec4(nextPosition, 1.0);

  // get 2D screen space with W divide and aspect correct
  vec2 prevScreen = prevProjected.xy / prevProjected.w * aspectVec;
  vec2 currScreen = currProjected.xy / currProjected.w * aspectVec;
  vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

  float len = thickness;

  // starting point uses (next - current)
  vec2 dir = vec2(0.0);
  if (currScreen == prevScreen) {
    dir = normalize(nextScreen - prevScreen);
  }
  else if (currScreen == nextScreen) {
    dir = normalize(currScreen - prevScreen);
  }  
  // somewhere in the middle needs a join
  else {
    // get directions from (C - B) and (B - A)
    vec2 dirA = normalize(currScreen - prevScreen);
    if (miter == 1) {
      vec2 dirB = normalize(nextScreen - currScreen);
      // now compute the miter join normal and length
      vec2 tangent = normalize(dirA + dirB);
      vec2 perp = vec2(-dirA.y, dirA.x);
      vec2 miter = vec2(-tangent.y, tangent.x);
      dir = tangent;
      len = thickness / dot(miter, perp);
    } else {
      dir = dirA;
    }
  }

  vec2 normal = vec2(-dir.y, dir.x) * thickness;
  normal.x /= aspect;
  vec4 offset = vec4(normal * offsetScale, 0.0, 1.0);
  gl_Position = currProjected + offset;
}