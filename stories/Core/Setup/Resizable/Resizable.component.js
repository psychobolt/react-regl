// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';

import * as styles from './Resizable.style';

const { ReglContainer } = ReactRegl;

const View = styled.canvas`
  ${styles.canvas}
`;

type ViewProps = {};

type Props = {
  viewProps: ViewProps,
  children: React.Node
};

export default ({ children, ...props }: Props) => (
  <ReactResizeDetector handleWidth handleHeight>
    {({ width, height }) => (
      <ReglContainer
        {...props}
        View={View}
        viewProps={{ width, height, ...(props.viewProps: $Rest<ViewProps, any>) }}
      >
        {children || (width && height && console.log(`${width} x ${height}`)) /* eslint-disable-line no-console */ }
      </ReglContainer>
    )}
  </ReactResizeDetector>
);
