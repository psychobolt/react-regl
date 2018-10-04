import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from 'dist';

import * as styles from './Container.style';

const View = styled.div`
  ${styles.container}
`;

export default () => (
  <ReglContainer View={View} />
);
