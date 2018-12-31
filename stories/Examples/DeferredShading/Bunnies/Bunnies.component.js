// @flow
import * as React from 'react';
import { defaultMemoize } from 'reselect';
import bunny from 'bunny';
import normals from 'angle-normals';

import Mesh from '../Mesh';

const N_BUNNIES = 5; // number of bunnies.

function negMod(x, n) { // modulo that works for negative numbers
  return ((x % n) + n) % n;
}

type Props = {
  planeSize: number
};

const getBunnies = defaultMemoize(S => {
  const bunnies = [];
  // There's lots of magic numbers bellow, and they were simply chosen because
  // they make it look good. There's no deeper meaning behind them.
  for (let x = -N_BUNNIES; x <= N_BUNNIES; x += 1) {
    for (let z = -N_BUNNIES; z <= N_BUNNIES; z += 1) {
      // we use these two to generate psuedo-random numbers.
      const xs = x / (N_BUNNIES + 1);
      const zs = z / (N_BUNNIES + 1);

      // psuedo-random color
      const c = [
        ((Math.abs(3 * x + 5 * z + 100) % 10) / 10) * 0.64,
        ((Math.abs(64 * x + x * z + 23) % 13) / 13) * 0.67,
        ((Math.abs(143 * x * z + x * z * z + 19) % 11) / 11) * 0.65,
      ];

      const A = S / 20; // max bunny displacement amount.
      // compute random bunny displacement
      const xd = (negMod(z * z * 231 + x * x * 343, 24) / 24) * 0.97 * A;
      const zd = (negMod(z * x * 198 + x * x * z * 24, 25) / 25) * 0.987 * A;

      // random bunny scale.
      const s = ((Math.abs(3024 * z + 5239 * x + 1321) % 50) / 50) * 3.4 + 0.9;
      // random bunny rotation
      const r = ((Math.abs(9422 * z * x + 3731 * x * x + 2321) % 200) / 200) * 2 * Math.PI;

      // translation
      const t = [xs * S / 2.0 + xd, -0.2, zs * S / 2.0 + zd];

      const args = { scale: s, translate: t, yRotate: r };

      bunnies.push(
        <Mesh
          key={`bunny_${x}_${z}`}
          elements={bunny.cells}
          position={bunny.positions}
          normal={normals(bunny.cells, bunny.positions)}
          color={c}
          args={args}
        />,
      );
    }
  }
  return bunnies;
});

export default ({ planeSize: S }: Props) => getBunnies(S);
