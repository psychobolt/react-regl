// @flow
import * as React from 'react';
import rgba from 'color-normalize';

import { ReglContainer, Frame } from '@psychobolt/react-regl';
import { Pyramid } from '@psychobolt/react-regl-fractals';

export { default as MDX } from 'packages/react-regl-fractals/src/Pyramid/README.md';

const clear = ({ regl }) => regl.clear({
  color: [1, 1, 1, 1],
  depth: 1,
});

const contextProps = {
  extensions: 'oes_standard_derivatives',
};

type Props = {
  color: number,
  lineColor: number,
  outline: boolean,
};

export default (({ color, lineColor, outline, ...props }: Props) => (
  <ReglContainer onMount={clear} contextProps={contextProps}>
    <Frame onFrame={clear}>
      <Pyramid
        {...props}
        color={rgba(color)}
        wireframeColor={rgba(lineColor)}
        wireframe={outline}
      />
    </Frame>
  </ReglContainer>
): React.AbstractComponent<Props>);
