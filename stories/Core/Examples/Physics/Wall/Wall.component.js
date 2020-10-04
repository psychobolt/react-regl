// @flow
import * as React from 'react';

import Box from './Box';

// create wall.
const WALL_HEIGHT = 12;
const WALL_WIDTH = 30;
const size = [1.0, 1.0, 2.0];

type Props = {
  physicsWorld: any,
}

export default (({ physicsWorld }: Props) => {
  const bricks = [];
  let id = 1;

  for (let i = 0; i < WALL_HEIGHT; i += 1) {
    for (let j = 0; j < WALL_WIDTH; j += 1) {
      const x = i * i + 2.1;
      const z = j * j + 2.5;
      const c = [
        ((Math.abs(3 * x + 5 * z + 100) % 10) / 10) * 0.64,
        ((Math.abs(64 * x + x * z + 23) % 13) / 13) * 0.67,
        ((Math.abs(143 * x * z + x * z * z + 19) % 11) / 11) * 0.65,
      ];

      bricks.push(
        <Box
          key={`box_${id}`}
          color={c}
          position={[0.0, 0.5 + i * 1.0, -5.0 + 2.0 * (j - WALL_WIDTH / 2)]}
          size={size}
          physicsWorld={physicsWorld}
        />,
      );

      id += 1;
    }
  }

  return bricks;
}: React.AbstractComponent<Props>);
