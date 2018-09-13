import React from 'react';
import mouseChange from 'mouse-change';

import { ReglContainer, Resource, Context, Frame, Drawable } from '@psychobolt/react-regl';

import map from './map.json';
import image from './tiles.png';
import frag from './Tile.frag';
import vert from './Tile.vert';

const mouse = mouseChange();

const boxH = 10;
const onUpdate = ({ viewportWidth, viewportHeight, draw }) => {
  const { x, y } = mouse;

  const boxX = map[0].length * x / viewportWidth;
  const boxY = map.length * y / viewportHeight;
  const boxW = viewportWidth / viewportHeight * boxH;

  draw({
    view: [
      boxX - 0.5 * boxW,
      boxY - 0.5 * boxH,
      boxX + 0.5 * boxW,
      boxY + 0.5 * boxH,
    ],
  });
};

const depth = { enable: false };

const attributes = {
  position: [-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1],
};

export default () => (
  <ReglContainer>
    <Context.Consumer>
      {({ context }) => (
        <Resource
          manifest={{
            tiles: {
              type: 'image',
              src: image,
              parser: context.regl.texture,
            },
          }}
        >
          {({ tiles }) => (
            <Frame onUpdate={onUpdate}>
              <Drawable
                frag={frag}
                vert={vert}
                depth={depth}
                uniforms={{
                  tiles,
                  tileSize: [16.0, 16.0],
                  map: context.regl.texture(map),
                  mapSize: [map[0].length, map.length],
                  view: context.regl.prop('view'),
                }}
                attributes={attributes}
                count={6}
              />
            </Frame>
          )}
        </Resource>
      )}
    </Context.Consumer>
  </ReglContainer>
);
