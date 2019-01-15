import React from 'react';
import { Frame, Drawable } from '@psychobolt/react-regl';
import { MultiReglContainer, View } from '@psychobolt/react-multi-regl';
import styled from 'styled-components';
import perspective from 'gl-mat4/perspective';
import lookAt from 'gl-mat4/lookAt';
import sphereMesh from 'sphere-mesh';

import * as styles from './SPHGallery.style';
import vert from './SPHGallery.vert';
import frag from './SPHGallery.frag';

const sphere = sphereMesh(30, 1);
const viewMatrix = new Float32Array(16);
const projectionMatrix = new Float32Array(16);

const colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [0, 0, 0],
];

const degrees = [
  [1, 1, 1],
  [3, 4, 5],
  [8, 9, 1],
  [2, 3, 0],
  [8, 8, 1],
  [10, 20, 30],
  [2, -1, 3],
];

const directions = [
  [1, 0, 0],
  [1, 3, 2],
  [2, 2, 9],
  [0, 8, 1],
  [1, -1, 3],
  [9, -2, 1],
  [0, 0, 1],
];

const Container = styled.div`${styles.container}`;

const Subviews = React.forwardRef((props, ref) => colors.map((color, i) => <Container key={`container${i + 1}`} {...props} ref={ref} />));

function onFrame({ regl }) {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
  });
}

const projection = ({ viewportWidth, viewportHeight }) => perspective(
  projectionMatrix,
  Math.PI / 4.0,
  viewportWidth / viewportHeight,
  0.1,
  1000.0,
);

const attributes = {
  position: sphere.positions,
};

const view = ({ tick }) => {
  const t = 0.01 * tick;
  return lookAt(
    viewMatrix,
    [20.0 * Math.cos(t), 0, 20.0 * Math.sin(t)],
    [0, 0, 0],
    [0, 1, 0],
  );
};

export default () => (
  <MultiReglContainer View={Subviews} viewCount={colors.length}>
    {views => views.map((container, i) => (
      <View key={`view_${i + 1}`} element={container}>
        <Frame onFrame={onFrame}>
          <Drawable
            vert={vert}
            frag={frag}
            uniforms={{
              projection,
              view,
              direction: directions[i],
              degree: degrees[i],
              color: colors[i],
            }}
            attributes={attributes}
            elements={sphere.cells}
          />
        </Frame>
      </View>
    ))}
  </MultiReglContainer>
);
