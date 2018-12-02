# Planar Reflection Example

This example shows how you can render planar reflections using the stencil buffer.

We are using the algorithm described [here](http://www.cse.chalmers.se/edu/year/2015/course/TDA361/shadrefl.pdf#page=60)

To render the reflections, we mirror all the meshes on the y-axis, and then render them, and then we render the floor with alpha blending over them. However, we use the stencil buffer to make sure that the mirrored objects are only visible in the reflecting white tiles. If we did not use the stencil buffer, we would be able to see the mirrored meshes under the floor, which is weird.