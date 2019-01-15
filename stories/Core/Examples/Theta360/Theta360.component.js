import React from 'react';
import mat4 from 'gl-mat4';

import { ReglContainer, Context, Resource, Texture, Frame } from '@psychobolt/react-regl';

import oregon from './ogd-oregon-360.jpg';

import EnvMap from './EnvMap';
import Background from './Background';
import Bunny from './Bunny';

const onFrame = ({ tick, draw }) => {
  const t = 0.01 * tick;
  draw({
    view: mat4.lookAt(
      [],
      [30 * Math.cos(t), 2.5, 30 * Math.sin(t)],
      [0, 2.5, 0],
      [0, 1, 0],
    ),
  });
};

export default () => (
  <ReglContainer>
    <Texture>
      {envmap => (
        <Context.Consumer>
          {({ context }) => (
            <Resource
              manifest={{
                envmap: {
                  type: 'image',
                  stream: true,
                  src: oregon,
                  parser: envmap,
                },
              }}
              onProgress={fraction => {
                const intensity = 1.0 - fraction;
                context.regl.clear({
                  color: [intensity, intensity, intensity, 1],
                });
              }}
            >
              <Frame onUpdate={onFrame}>
                <EnvMap envmap={envmap}>
                  <Background />
                  <Bunny />
                </EnvMap>
              </Frame>
            </Resource>
          )}
        </Context.Consumer>
      )}
    </Texture>
  </ReglContainer>
);
