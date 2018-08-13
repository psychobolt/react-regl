// @flow
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';

import { ReglContainer } from 'src';

import * as styles from './Resizable.style';

const Canvas = styled.canvas`
  ${styles.canvas}
`;

const View = React.forwardRef((props, ref) => <Canvas {...props} innerRef={ref} />);

type Props = {
  viewProps: {},
  children: React.ReactNode
};

export default ({ children, ...props }: Props) => (
  <ReactResizeDetector handleWidth handleHeight>
    {(width, height) => (
      <ReglContainer {...props} View={View} viewProps={{ width, height, ...props.viewProps }}>
        {children || (width && height && console.log(`${width} x ${height}`)) /* eslint-disable-line no-console */ }
      </ReglContainer>
    )}
  </ReactResizeDetector>
);
