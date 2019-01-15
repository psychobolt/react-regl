import React from 'react';
import { Frame } from '@psychobolt/react-regl';
import { MultiReglContainer } from '@psychobolt/react-multi-regl';
import styled from 'styled-components';

import * as styles from './Simple.style';

const colors = [
  [1, 0, 0, 1],
  [0, 1, 0, 1],
  [0, 0, 1, 1],
  [1, 1, 0, 1],
  [1, 0, 1, 1],
  [0, 1, 1, 1],
  [0, 0, 0, 1],
];

const Container = styled.div`${styles.container}`;

const Subviews = React.forwardRef((props, ref) => colors.map((color, i) => (
  <Container
    key={`container${i + 1}`}
    {...props}
    ref={ref}
    color={`#ff${i % 2 ? '8000' : '0080'}`}
  />
)));

export default () => (
  <MultiReglContainer View={Subviews} viewCount={colors.length}>
    {views => views.map((view, i) => (
      <Frame key={`frame${i + 1}`} onFrame={({ regl }) => regl.clear({ color: colors[i] })} />
    ))}
  </MultiReglContainer>
);
