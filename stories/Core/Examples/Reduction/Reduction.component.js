import React, { Suspense } from 'react';
import { unstable_createResource as createResource } from 'react-cache';
import { ReglContainer, Context } from '@psychobolt/react-regl';
import seedrandom from 'seedrandom';

import Reduce, { cpuReduce } from './Reduce';

const viewProps = {
  width: 1,
  height: 1,
};

const SAMPLES = 1000;

// we will run the reduction on some random data.
const seed = 'seed';
const rng = seedrandom(seed);
const data = [];
for (let i = 0; i < 1024 * 1024; i += 1) {
  data.push(Math.floor(rng() * 255));
}

function profile(reduce, i, total, resolve = () => {}) {
  if (i < SAMPLES) {
    const t0 = performance.now();
    reduce();
    const t1 = performance.now();
    setTimeout(() => profile(reduce, i + 1, total + t1 - t0, resolve), 0);
  } else {
    const avg = total / SAMPLES;
    const avgStr = Math.round(avg * 100) / 100;
    resolve(`${avgStr} ms`);
  }
}

const cpuReduceCreate = () => {
  const CPUProfileResource = createResource(() => new Promise(
    resolve => setTimeout(profile(() => cpuReduce(data), 0, 0, resolve), 0),
  ));
  return () => <p>{`Average time of reduction on the CPU: ${CPUProfileResource.read()}`}</p>;
};

let getTime = () => {};

const resolver = new Promise(resolve => {
  getTime = resolve;
});

function onUpdate({ draw }) {
  setTimeout(profile(draw, 0, 0, value => getTime(value)), 0);
}

const gpuReduceCreate = () => {
  const GPUProfileResource = createResource(() => resolver);
  return () => <p>{`Average time of reduction on the GPU: ${GPUProfileResource.read()}`}</p>;
};

export default () => {
  const CPUReduce = cpuReduceCreate();
  const GPUReduce = gpuReduceCreate();
  return (
    <div>
      <h3>Doing reduction on 1,000,000 items:</h3>
      <Suspense fallback={<p>Running reduction on CPU...</p>}><CPUReduce /></Suspense>
      <Suspense fallback={<p>Running reduction on GPU...</p>}><GPUReduce /></Suspense>
      <ReglContainer View="canvas" viewProps={viewProps}>
        <Context.Consumer>
          {({ context }) => <Reduce data={data} regl={context.regl} onUpdate={onUpdate} />}
        </Context.Consumer>
      </ReglContainer>
    </div>
  );
};
