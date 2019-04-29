import React from 'react';
import { ReglContainer, Resource, Texture, Context, Frame, Drawable } from '@psychobolt/react-regl';

import frag from './Video.frag';
import vert from './Video.vert';
import doggie from './doggie-chromakey.mp4';

const attributes = {
  position: [
    -2, 0,
    0, -2,
    2, 2,
  ],
};

const manifest = {
  video: {
    type: 'video',
    src: doggie,
    stream: true,
  },
};

const onDone = ({ video }) => {
  Object.assign(video, {
    autoplay: true,
    loop: true,
  });
  video.play();
};

const screenShape = ({ viewportWidth, viewportHeight }) => [viewportWidth, viewportHeight];

export default () => (
  <ReglContainer>
    <Resource
      manifest={manifest}
      onDone={onDone}
    >
      {({ video }) => (
        <Texture source={video}>
          {texture => (
            <Frame
              onUpdate={({ draw }) => {
                draw({ video: texture.subimage(video) });
              }}
            >
              <Context.Consumer>
                {({ context }) => (
                  <Drawable
                    frag={frag}
                    vert={vert}
                    attributes={attributes}
                    uniforms={{
                      texture: context.regl.prop('video'),
                      screenShape,
                      time: context.regl.context('time'),
                    }}
                    count={3}
                  />
                )}
              </Context.Consumer>
            </Frame>
          )}
        </Texture>
      )}
    </Resource>
  </ReglContainer>
);
