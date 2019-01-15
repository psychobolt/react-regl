import React from 'react';
import { ReglContainer, Context, Resource, Frame, Drawable } from '@psychobolt/react-regl';
import parseDDS from 'parse-dds';

import alpineCliffDDS from './alpine_cliff_a.dds';
import alpineCliffSpec from './alpine_cliff_a_spec.png';
import alpineCliffNorm from './alpine_cliff_a_norm.png';

import frag from './DDS.frag';
import vert from './DDS.vert';

const contextProps = {
  extensions: 'WEBGL_compressed_texture_s3tc',
};

const attributes = {
  position: [
    -2, 0,
    0, -2,
    2, 2,
  ],
};

const lightPosition = ({ tick }) => {
  const t = 0.025 * tick;
  return [2.0 * Math.cos(t), 2.0 * Math.sin(t)];
};

export default () => (
  <ReglContainer contextProps={contextProps}>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            diffuse: {
              type: 'binary',
              src: alpineCliffDDS,
              parser: data => {
                const dds = parseDDS(data);
                const image = dds.images[0];
                return context.regl.texture({
                  format: `rgba s3tc ${dds.format}`,
                  shape: dds.shape,
                  mag: 'linear',
                  data: new Uint8Array(data, image.offset, image.length),
                });
              },
            },
            specular: {
              type: 'image',
              src: alpineCliffSpec,
              parser: data => context.regl.texture({
                mag: 'linear',
                data,
              }),
            },
            normals: {
              type: 'image',
              src: alpineCliffNorm,
              parser: data => context.regl.texture({
                mag: 'linear',
                data,
              }),
            },
          }}
        >
          {({ diffuse, specular, normals }) => (
            <Frame>
              <Drawable
                frag={frag}
                vert={vert}
                attributes={attributes}
                uniforms={{
                  specular,
                  normals,
                  diffuse,
                  lightPosition,
                }}
                count={3}
              />
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
