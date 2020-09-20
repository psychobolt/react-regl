import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from '@psychobolt/react-regl';

import * as styles from './Container.style';

const View = styled.div`
  ${styles.container}
`;

export default () => (
  <ReglContainer View={View} />
);
