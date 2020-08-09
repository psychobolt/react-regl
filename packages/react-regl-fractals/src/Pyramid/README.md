# Pyramid (Work In Progress)

Renders Sierpinski Triangle with a certain degree. May have slow perfomance after 8.

## Example

```jsx
import React from 'react';
import { ReglContainer } from '@psychobolt/react-regl'
import { Pyramid } from '@psychobolt/react-regl-fractals';

export default () => {
  <ReglContainer>
    <Pyramid degree={2}>
  </ReglContainer>
}
```