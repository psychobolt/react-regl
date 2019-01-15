import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from 'dist';

import * as styles from './Canvas.style';

const View = styled.canvas`
  ${styles.canvas}
`;

export default () => (
  <ReglContainer View={View} />
);
