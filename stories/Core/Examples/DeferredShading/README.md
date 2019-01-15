# Deferred Shading

This example is a simple implementation of deferred shading.

The focus of this implementation was readability, so it is not an optimized implementation, and can certainly be made more efficient. (by for instance getting ride of the "position" render target. It can be computed from the depth buffer.)

This example demonstrates the usage of Multiple-render targets in regl.