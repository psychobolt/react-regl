import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from 'dist';

import * as styles from './Canvas.style';

const StyledCanvas = styled.canvas`
  ${styles.canvas}
`;

const View = React.forwardRef((props, ref) => <StyledCanvas {...props} innerRef={ref} />);

export default () => (
  <ReglContainer View={View} />
);
