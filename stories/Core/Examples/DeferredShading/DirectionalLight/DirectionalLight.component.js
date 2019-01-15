// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import frag from './DirectionalLight.frag';
import vert from './DirectionalLight.vert';

const depth = {
  enable: true,
};

const attributes = {
  // We implement the full-screen pass by using a full-screen triangle
  position: [-4, -4, 4, -4, 0, 4],
};

const ambientLight = [0.3, 0.3, 0.3];

const diffuseLight = [0.7, 0.7, 0.7];

const lightDir = [0.39, 0.87, 0.29];

type Props = {
  fbo: any
};

export default ({ fbo }: Props) => (
  <Drawable
    frag={frag}
    vert={vert}
    attributes={attributes}
    uniforms={{
      albedoTex: fbo.color[0],
      normalTex: fbo.color[1],
      ambientLight,
      diffuseLight,
      lightDir,
    }}
    depth={depth}
    count={3}
  />
);
