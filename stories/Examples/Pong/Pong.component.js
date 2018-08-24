import React from 'react';
import { AudioContext } from 'standardized-audio-context';
import mouseChange from 'mouse-change';
import vec2 from 'gl-vec2';

import { ReglContainer, Context, Frame, Drawable } from 'src';

import frag from './Pong.frag';
import vert from './Pong.vert';

// we keep track of the mouse y-coordinate.
let mouseY = null;
mouseChange((buttons, x, y) => {
  mouseY = y;
});

function Aabb(c, r) {
  // Aaab center.
  this.c = vec2.fromValues(c[0], c[1]);

  // Aabb radiuses(halfwidths)
  this.r = vec2.fromValues(r[0], r[1]);
}

// Below are all the global objects.

const playerPaddle = new Aabb([-0.9, 0.0], [0.03, 0.15]);
const aiPaddle = new Aabb([+0.9, 0.0], [0.03, 0.15]);

const midline = new Aabb([+0.0, 0.0], [0.005, 1.0]);

// we set all ball properties in resetBall()
const ball = new Aabb([0.0, 0.0], [0.0, 0.0]); // set velocity
let ballVel = vec2.fromValues(0.0, 0.0);

const audioContext = new AudioContext();
const volume = 0.1;

function clamp(value, min, max) {
  return min < max // eslint-disable-line no-nested-ternary
    ? (value < min ? min : value > max ? max : value) // eslint-disable-line no-nested-ternary
    : (value < max ? max : value > min ? min : value); // eslint-disable-line no-nested-ternary
}

function detectAabbCollision(a, b, r) {
  const x0 = +(a.c[0] - b.c[0]) - (a.r[0] + b.r[0]);
  const x1 = -(a.c[0] - b.c[0]) - (a.r[0] + b.r[0]);
  if (x0 > 0.0 || x1 > 0.00) return false;

  const y0 = +(a.c[1] - b.c[1]) - r * (a.r[1] + b.r[1]);
  const y1 = -(a.c[1] - b.c[1]) - r * (a.r[1] + b.r[1]);
  if (y0 > 0.0 || y1 > 0.0) return false;

  // a and b overlap on all axes. So we have collision.
  // Now we need to find the contact normal.

  if (x0 > x1 && x0 > y0 && x0 > y1) {
    return vec2.fromValues(-1.0, 0.0);
  }
  if (x1 > x0 && x1 > y0 && x1 > y1) {
    return vec2.fromValues(+1.0, 0.0);
  }

  if (y0 > x0 && y0 > x1 && y0 > y1) {
    return vec2.fromValues(0.0, -1.0);
  }
  if (y1 > x0 && y1 > x1 && y1 > y0) {
    return vec2.fromValues(0.0, +1.0);
  }
  return false;
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

const RANGE = 1.2;

function resetBall(playerWon) {
  ball.c = [+0.0, 0.0];
  ball.r = [0.02, 0.02];

  const speed = getRand(0.3, 0.4);

  let theta;
  if (!playerWon) {
    theta = getRand(-RANGE, +RANGE);
    ballVel = [speed * Math.cos(theta), speed * Math.sin(theta)];
  } else {
    theta = getRand(Math.PI - RANGE, Math.PI + RANGE);
    ballVel = [speed * Math.cos(theta), speed * Math.sin(theta)];
  }
}

// create audio buffer that lasts 'length' seconds, and 'createAudioDataCallback'
// will fill each of the two channels of the buffer with audio data.
const channels = 2;
function createAudioBuffer(length, createAudioDataCallback) {
  const frameCount = audioContext.sampleRate * length;
  const audioBuffer = audioContext.createBuffer(channels, frameCount, audioContext.sampleRate);

  for (let channel = 0; channel < channels; channel += 1) {
    const channelData = audioBuffer.getChannelData(channel);
    createAudioDataCallback(channelData, frameCount);
  }
  return audioBuffer;
}

function playAudioBuffer(audioBuffer) {
  // Appearently, you have to create a new AudioBufferSourceNode
  // every time you want to play a sound again.
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}

// When the ball collides with something, we alternate between playing two sound effects
// Both sound effects are just simple square waves.
const hitAudioBuffers = [];

hitAudioBuffers[0] = createAudioBuffer(
  0.15,
  (channelData, frameCount) => {
    let current = volume;
    for (let i = 0; i < frameCount; i += 1) {
      if (i % 100 === 0) {
        current *= -1.0;
      }
      channelData[i] = current * (1.0 - i / frameCount); // eslint-disable-line no-param-reassign
    }
  },
);

hitAudioBuffers[1] = createAudioBuffer(
  0.15,
  (channelData, frameCount) => {
    let current = volume;
    for (let i = 0; i < frameCount; i += 1) {
      if (i % 150 === 0) {
        current *= -1.0;
      }
      channelData[i] = current * (1.0 - i / frameCount); // eslint-disable-line no-param-reassign
    }
  },
);

// We play this sound when the player wins.
// It is just a square wave, with some simple frequency modulation.
const winAudioBuffer = createAudioBuffer(
  0.4,
  (channelData, frameCount) => {
    let current = volume;
    let period = 50;
    for (let i = 0; i < frameCount; i += 1) {
      if (i % period === 0) {
        current *= -1.0;
      }
      if (i % 600 === 0) {
        period -= 2;
      }
      const a = (i / frameCount);
      channelData[i] = current * (1.0 - a); // eslint-disable-line no-param-reassign
    }
  },
);

// We play this sound when the player loses.
// It is just white noise.
const loseAudioBuffer = createAudioBuffer(
  0.5,
  (channelData, frameCount) => {
    let current = getRand(-volume, +volume);
    for (let i = 0; i < frameCount; i += 1) {
      if (i % 150 === 0) {
        current = getRand(-volume, +volume);
      }
      channelData[i] = current * (1.0 - i / frameCount); // eslint-disable-line no-param-reassign
    }
  },
);

// compute the reflection vector for an incident vector `v` against
// a surface with the normal `n`.
// but note that the kinetic energy is slightly increased
// with the reflection
let iHitAudioBuffer = 0;
function reflect(v, n) {
  const scratch = [0.0, 0.0];

  // alternatively, play sound effect.
  playAudioBuffer(hitAudioBuffers[iHitAudioBuffer]);
  iHitAudioBuffer = (iHitAudioBuffer + 1) % 2;

  // if it were perfect elastic collision, this would be 1.0
  // But we want the ball to become faster with every bounce,
  // so we set it to a slightly higher value.
  const cr = 1.1;
  return vec2.subtract(v, v, vec2.scale(scratch, n, (1.0 + cr) * vec2.dot(v, n)));
}

const attributes = {
  position: [
    [-1, -1], [+1, +1], [-1, +1],
    [-1, -1], [+1, -1], [+1, +1],
  ],
};

const offset = (_, { aabb }) => aabb.c;
const scale = (_, { aabb }) => aabb.r;

const depth = {
  enable: false,
};

const cull = {
  enable: true,
};

const onMount = () => resetBall(true);

const onUpdate = ({ viewportWidth, viewportHeight, pixelRatio, regl, draw }) => {
  regl.clear({
    color: [0, 0, 0, 1],
  });

  const deltaTime = 0.017;

  // We use this ratio r in order to make sure that all renderered
  // objects keep their proportions on different screen sizes
  // Note that we made the assumption that the screen has greater width
  // than height!
  // And we can't just calculate this value once and then cache it, because the
  // user may resize the browser window while playing!
  const r = viewportWidth / viewportHeight;

  //
  // BEGIN GAME LOGIC
  //

  const minY = -1 + playerPaddle.r[1] * r;
  const maxY = +1 + playerPaddle.r[1] * r;
  // player paddle follows the mouse
  if (mouseY !== null) {
    // this maps the mouse y-coordinates to the range[0,1]
    // we must take the pixel ratio in to account, so that it handles
    // retina displays and such.
    const a = 1.0 - (mouseY * pixelRatio) / viewportHeight;
    // Map from [0,1] to our coordinates system(which is [-1, -1])
    // also, clamp to ensure that the paddle does not move outside the screen boundaries.
    playerPaddle.c[1] = clamp(-1.0 + 2.0 * (a), minY, maxY);
  }

  // AI paddle follows the ball.
  const dist = (ball.c[1] - aiPaddle.c[1]);
  aiPaddle.c[1] = clamp(aiPaddle.c[1] + dist * deltaTime * 1.9, minY, maxY);

  // Move ball.
  vec2.scaleAndAdd(ball.c, ball.c, ballVel, deltaTime);

  // Handle ball collision north wall
  if ((ball.c[1] + r * ball.r[1]) >= 1.0) {
    ballVel = reflect(ballVel, vec2.fromValues(0.0, -1.0));
  }

  // Handle ball collision east wall
  if ((ball.c[0] + ball.r[0]) >= 1.0) {
    playAudioBuffer(winAudioBuffer);
    // player win. Reset ball
    resetBall(true);
  }

  // Handle ball collision south wall
  if ((ball.c[1] - r * ball.r[1]) <= -1.0) {
    ballVel = reflect(ballVel, vec2.fromValues(0.0, 1.0));
  }

  // Handle ball collision west wall
  if ((ball.c[0] - ball.r[0]) <= -1.0) {
    playAudioBuffer(loseAudioBuffer);
    // player loss. Reset ball.
    resetBall(false);
  }

  // handle ball and AI paddle collision
  let result = detectAabbCollision(aiPaddle, ball, r);
  if (result !== false) {
    const n = result; // if collision, the return value is the contact normal.
    ballVel = reflect(ballVel, n);
  }

  // handle ball and player paddle collision
  result = detectAabbCollision(playerPaddle, ball, r);
  if (result !== false) {
    const n = result; // if collision, the return value is the contact normal.
    ballVel = reflect(ballVel, n);
  }

  //
  // END GAME LOGIC
  //

  //
  // Render everything.
  //

  draw([
    { aabb: playerPaddle },
    { aabb: aiPaddle },
    { aabb: midline },
    { aabb: ball },
  ]);
};

export default () => (
  <ReglContainer onMount={onMount}>
    <Frame onUpdate={onUpdate}>
      <Context.Consumer>
        {({ context }) => (
          <Drawable
            frag={frag}
            vert={vert}
            attributes={attributes}
            uniforms={{
              offset,
              scale,
              viewportWidth: context.regl.context('viewportWidth'),
              viewportHeight: context.regl.context('viewportHeight'),
            }}
            depth={depth}
            cull={cull}
            count={6}
          />
        )}
      </Context.Consumer>
    </Frame>
  </ReglContainer>
);
