precision mediump float;

attribute vec4 position;
attribute vec3 normal0, normal1;

uniform vec3 lightDir;
uniform mat4 camera;
uniform mat4 model;

void main() {
  /*
    Every edge of the rabbit is assigned a triangle. To all the vertices of that assigned
    triangle, we assign the face-normals of the two triangles incident to that edge.

    For that assigned triangle we have that:
    The first vertex is the first edge-vertex, and w=1
    The second vertex is the second edge-vertex, and w=1
    The third vertex is simply (0, 0, 0, 0)

    Now clearly, only if first normal is facing the light, and the second normal is facing
    away from the light. we have that the edge is part of the shadow silhouette.

    If it is part of the silhouetee, we project the first and second vertices to infinity,
    in the direction of the light.
    For the third vertex, we have that w=0, so it is kept in place.
    Because the three vertices are placed in this way, the shadow silhouette is created for
    that edge.
    So that's how this vertex shader works.

    (if the above doesn't make sense, try drawing it out on paper. It will make sense.)
  */
  if (dot(normal0, lightDir) <= 0.0 && dot(normal1, lightDir) >= 0.0) {
    gl_Position = camera * model * (position + vec4((1.0 - position.w) * lightDir, 0.0));
  } else {
    gl_Position = vec4(0, 0, 0, 0);
  }
}