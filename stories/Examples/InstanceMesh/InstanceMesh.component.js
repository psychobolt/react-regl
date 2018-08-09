import React from 'react';
import styled from 'styled-components';

import { ReglContainer } from 'src';

// import frag from './InstanceMesh.frag';
// import vert from './InstanceMesh.vert';
import * as styles from './InstanceMesh.style';

const Canvas = styled.div`
  ${styles.canvas}
`;

const View = React.forwardRef((props, ref) => <Canvas {...props} innerRef={ref} />);

const contextProps = {
  extensions: ['angle_instanced_arrays'],
};

export default () => (
  <ReglContainer View={View} contextProps={contextProps} />
);
