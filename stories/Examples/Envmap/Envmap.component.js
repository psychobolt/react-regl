import React from 'react';
import { ReglContainer, Resource, Cube, Frame, Context, Drawable } from '@psychobolt/react-regl';
import mat4 from 'gl-mat4';

import Background from './Background';
import Bunny from './Bunny';
import frag from './Envmap.frag';
import posxImage from './posx.jpg';
import negxImage from './negx.jpg';
import posyImage from './posy.jpg';
import negyImage from './negy.jpg';
import poszImage from './posz.jpg';
import negzImage from './negz.jpg';

const envMapContext = {
  view: ({ tick }) => {
    const t = 0.01 * tick;
    return mat4.lookAt(
      [],
      [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
      [0, 2.5, 0],
      [0, 1, 0],
    );
  },
};

const projection = ({ viewportWidth, viewportHeight }) => mat4.perspective(
  [],
  Math.PI / 4,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

const invView = ({ view }) => mat4.invert([], view);

const manifest = {
  posx: {
    type: 'image',
    src: posxImage,
  },
  negx: {
    type: 'image',
    src: negxImage,
  },
  posy: {
    type: 'image',
    src: posyImage,
  },
  negy: {
    type: 'image',
    src: negyImage,
  },
  posz: {
    type: 'image',
    src: poszImage,
  },
  negz: {
    type: 'image',
    src: negzImage,
  },
};

export default () => (
  <ReglContainer>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={manifest}
          onProgress={fraction => {
            const intensity = 1.0 - fraction;
            context.regl.clear({
              color: [intensity, intensity, intensity],
            });
          }}
        >
          {({ posx, negx, posy, negy, posz, negz }) => (
            <Cube images={[posx, negx, posy, negy, posz, negz]}>
              {cube => (
                <Frame>
                  <Drawable
                    context={envMapContext}
                    frag={frag}
                    uniforms={{
                      envmap: context.regl.prop('cube'),
                      view: context.regl.context('view'),
                      projection,
                      invView,
                    }}
                    args={{ cube }}
                  >
                    <Background />
                    <Bunny />
                  </Drawable>
                </Frame>
              )}
            </Cube>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
