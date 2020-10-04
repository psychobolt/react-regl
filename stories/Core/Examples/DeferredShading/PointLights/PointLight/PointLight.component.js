// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import createSphere from 'primitive-sphere';
import mat4 from 'gl-mat4';

import frag from './PointLight.frag';
import vert from './PointLight.vert';

const { Context, Drawable } = ReactRegl;

const sphereMesh = createSphere(1.0, {
  segments: 16,
});

const depth = {
  enable: false,
};

type Props = {
  fbo: Object,
  args: any
};

const model = (_, { translate, radius: r }) => {
  const m = mat4.identity([]);
  mat4.translate(m, m, translate);
  mat4.scale(m, m, [r, r, r]);
  return m;
};

const attributes = {
  position: () => sphereMesh.positions,
  normal: () => sphereMesh.normals,
};

const elements = () => sphereMesh.cells;

// we use additive blending to combine the light spheres with the framebuffer
const blend = {
  enable: true,
  func: {
    src: 'one',
    dst: 'one',
  },
};

const cull = {
  enable: true,
};

export default (({ fbo, args }: Props) => (
  <Context.Consumer>
    {({ context }) => (
      <Drawable
        depth={depth}
        frag={frag}
        vert={vert}
        uniforms={{
          albedoTex: fbo.color[0],
          normalTex: fbo.color[1],
          positionTex: fbo.color[2],
          ambientLight: context.regl.prop('ambientLight'),
          diffuseLight: context.regl.prop('diffuseLight'),
          lightPosition: context.regl.prop('translate'),
          lightRadius: context.regl.prop('radius'),
          model,
        }}
        attributes={attributes}
        elements={elements}
        blend={blend}
        cull={cull}
        frontFace={// eslint-disable-line react/jsx-curly-brace-presence
          // We render only the inner faces of the light sphere.
          // In order worlds, we render the back-faces and not the front-faces of the sphere.
          // If we render the front-faces, the lighting of the light sphere disappears if
          // we are inside the sphere, which is weird. But by rendering the back-faces instead,
          // we solve this problem.
          'cw'
        }
        args={args}
      />
    )}
  </Context.Consumer>
): React.AbstractComponent<Props>);
