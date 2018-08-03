import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from 'dist';

import * as styles from './Container.style';

const StyledContainer = styled.div`
  ${styles.container}
`;

const View = React.forwardRef((props, ref) => <StyledContainer {...props} innerRef={ref} />);

export default () => (
  <ReglContainer View={View} />
);
