# Line Example

This example demonstrates rendering screen space projected lines from a technique described [here](https://mattdesl.svbtle.com/drawing-lines-is-hard).

This technique requires each vertex to reference the previous and next vertex in the line; this example utilizes attribute byte offsets to share a single position buffer for all three of these attributes.