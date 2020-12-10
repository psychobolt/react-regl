// @flow
import * as React from 'react';

import Mesh from '@psychobolt/react-regl-mesh';

import wireframeFrag from './Wireframe/Wireframe.frag';
import wireframeVert from './Wireframe/Wireframe.vert';

type Props = {
    wireframe: boolean,
    frag: string,
    vert: string,
    wireframeColor: number[],
    lineWidth: number,
    uniforms: {},
};

export default (({
  wireframe,
  frag,
  vert,
  wireframeColor = [0, 0, 0, 1],
  lineWidth = 1.0,
  uniforms,
  ...props
}: Props) => (
  <Mesh
    {...props}
    uniforms={{
      ...uniforms,
      ...(wireframe ? { wireframeColor, lineWidth } : undefined),
    }}
    frag={wireframe ? wireframeFrag : frag}
    vert={wireframe ? wireframeVert : vert}
    wireframe={wireframe}
  />
): React.AbstractComponent<Props>);
