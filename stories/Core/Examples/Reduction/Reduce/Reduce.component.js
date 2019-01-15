// @flow
import * as React from 'react';
import { Drawable } from '@psychobolt/react-regl';

import Pass from './Pass';

/*
  Reduction on the CPU
*/
export function cpuReduce(data: number[]) {
  let result = Math.max(data[0], data[1]);
  for (let i = 2; i < data.length; i += 1) {
    result = Math.max(result, data[i]);
  }
  return result;
}

type Props = {
  data: number[],
  regl: Object,
  onUpdate: () => void,
};

/*
  Reduction on the GPU.

  We basically use the technique described in section 37.2 of this article:
  https://developer.nvidia.com/gpugems/GPUGems/gpugems_ch37.html

  The algorithm: We basically start with a texture (A) of size (N)x(N). Then
  we create a FBO (B) of size (N/2)x(N/2). Then we render to FBO (B), and every
  fragment will sample four texels from (A). And by doing so, we will have performed
  a reduction of 2x2 sized blocks.

  Next, we create a FBO (C) of size (N/4)x(N/4), and, like above, we render to (C)
  while sampling from (B), and so on. We keep going until we are left with an FBO of
  size 1x1. And that single pixel in that FBO contains our desired result.

  Note that we are using a texture of type RGBAB in the below implementation. This means
  that we can't really use '+' as an operator for the reduction, since it will easily
  overflow. This can be solved by switching to a texture of type RGBA32F. But we are
  not using that, because it requires an extension that is not always available.
  So to maximize compability, we use RGBAB in this demo. So if you want to use the
  below reduce implementaion in your own code, you will probably have to switch to
  RGBA32F.

  And to simplify things, we will be making the assumption that data.length will be the
  one of the numbers 1x1, 2x2, 4x4, 8x8, 16x16, ...
*/
export default ({ data, regl, onUpdate }: Props) => {
  // We must use a texture format of type RGBA. Because you cannot create a single FBO of
  // type ALPHA in WebGL.
  const textureData = [];
  for (let i = 0; i < data.length; i += 1) {
    const g = data[i];
    textureData.push(g, g, g, g);
  }

  // dimensions of the first texture is (dim)X(dim)
  const DIM = Math.sqrt(data.length);
  let dim = DIM;

  const firstTexture = regl.texture({
    width: dim,
    height: dim,
    data: textureData,
    format: 'rgba',
    type: 'uint8',
    mag: 'nearest',
    min: 'nearest',
  });

  const fbos = [];
  do {
    dim >>= 1; // eslint-disable-line no-bitwise
    fbos.push(regl.framebuffer({
      colorFormat: 'rgba',
      colorType: 'uint8',
      width: dim,
      height: dim,
    }));
  } while (dim > 1);

  // the rest of the passes.
  const passes = [];
  for (let i = 0; i < fbos.length - 1; i += 1) {
    const inFbo = fbos[i];
    const outFbo = fbos[i + 1];
    passes.push(
      <Pass key={`pass_${i + 1}`} tex={inFbo.color[0]} framebuffer={outFbo} rcpDim={1.0 / (outFbo.width * 2)} />,
    );
  }

  return (
    <Drawable onUpdate={onUpdate}>
      <Pass key="pass_0" tex={firstTexture} framebuffer={fbos[0]} rcpDim={1.0 / (fbos[0].width * 2)} />
      {passes}
    </Drawable>
  );
};
