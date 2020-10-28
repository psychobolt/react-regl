// @flow
import * as React from 'react';
import Mesh from '@psychobolt/react-regl-mesh';
import bunny from 'bunny';

import frag from './Bunny.frag';
import vert from './Bunny.vert';

import wireframeVert from './Wireframe/Wireframe.vert';
import wireframeFrag from './Wireframe/Wireframe.frag';

type Props = {
  wireframe: boolean
};

export default (({ wireframe }: Props) => (
  <Mesh
    frag={wireframe ? wireframeFrag : frag}
    vert={wireframe ? wireframeVert : vert}
    positions={bunny.positions}
    cells={bunny.cells}
    normals
    wireframe={wireframe}
  />
): React.AbstractComponent<Props>);
