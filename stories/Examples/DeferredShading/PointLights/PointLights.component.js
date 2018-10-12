import React from 'react';

import PointLight from './PointLight';

const lights = ({ tick }) => {
  const pointLights = [];

  // There's lots of magic numbers below, and they were simply chosen because
  // they make it look good. There's no deeper meaning behind them.
  const makeRose = ({
    N, // the number of points
    n, // See the wikipedia article for a definition of n and d.
    d, // See the wikipedia article for a definition of n and d.
    v, // how fast the points traverse on the curve.
    R, // the radius of the rose curve.
    s, // use the parameter to spread out the points on the rose curve.
    seed, // random seed
  }) => {
    for (let j = 0; j < N; j += 1) {
      const i = j + seed;

      let theta = s * 2 * Math.PI * i * (1.0 / N);
      theta += tick * 0.01;

      const a = 0.8;

      const r = ((Math.abs(23232 * i * i + 100212) % 255) / 255) * 0.8452;
      const g = ((Math.abs(32278 * i + 213) % 255) / 255) * 0.8523;
      const b = ((Math.abs(3112 * i * i * i + 2137 + i) % 255) / 255) * 0.8523;

      const rad = ((Math.abs(3112 * i * i * i + 2137 + i * i + 232 * i) % 255) / 255)
        * 0.9 * 30.0 + 30.0;
      // See the wikipedia article for a definition of n and d.
      const k = n / d;
      pointLights.push({
        radius: rad,
        translate: [
          R * Math.cos(k * theta * v) * Math.cos(theta * v),
          20.9,
          R * Math.cos(k * theta * v) * Math.sin(theta * v),
        ],
        ambientLight: [a * r, a * g, a * b],
        diffuseLight: [r, g, b],
      });
    }
  };

  // We make the point light move on rose curves. This looks rather cool.
  // https://en.wikipedia.org/wiki/Rose_(mathematics)
  makeRose({ N: 10, n: 3, d: 1, v: 0.4, R: 300, seed: 0, s: 1 });
  makeRose({ N: 20, n: 7, d: 4, v: 0.6, R: 350, seed: 3000, s: 1 });
  makeRose({ N: 20, n: 10, d: 6, v: 0.7, R: 350, seed: 30000, s: 1 });
  makeRose({ N: 40, n: 7, d: 9, v: 0.7, R: 450, seed: 60000, s: 10 });

  return pointLights;
};

export default props => <PointLight {...props} args={lights} />;
