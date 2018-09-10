// @flow
import * as React from 'react';
import styled from 'styled-components';
import { AudioContext } from 'standardized-audio-context';
import perspective from 'gl-mat4/perspective';
import lookAt from 'gl-mat4/lookAt';

import { ReglContainer, Resource, Texture, Frame, Drawable } from 'src';

import * as styles from './Audio.style';
import vert from './Audio.vert';
import frag from './Audio.frag';
import mp3 from './8bitpeoples-bamboo-cactus.mp3';

const N = 256;

const contextProps = {
  pixelRatio: 1,
};

const manifest = {
  song: {
    type: 'audio',
    src: mp3,
    stream: true,
  },
};

const data = (new Uint8Array(N * N)).fill(128);

const width = N / 4;

const attributes = {
  vertId: Array(4 * N * N).fill().map((_, i) => {
    const x = 0.5 * Math.floor(i / (2 * N));
    const y = 0.5 * (i % (2 * N));
    return [
      x, y,
      x + 0.5, y,
      x, y + 0.5,
      x, y + 0.5,
      x + 0.5, y + 0.5,
      x + 0.5, y,
    ];
  }),
  N: {
    constant: N,
  },
};

const offsetRow = ({ tick }) => tick % N;

const projection = ({ viewportWidth, viewportHeight }) => perspective(
  [],
  Math.PI / 8,
  viewportWidth / viewportHeight,
  0.01,
  1000,
);

const view = ({ tick }) => lookAt(
  [],
  [
    0.5 + 0.2 * Math.cos(0.001 * tick),
    1,
    0.7 + 0.2 * Math.cos(0.003 * tick + 2.4),
  ],
  [0.5, 0, 0],
  [0, 0, 1],
);

const lightPosition = ({ tick }) => [
  0.5 + Math.sin(0.01 * tick),
  1.0 + Math.cos(0.01 * tick),
  1.0 + 0.6 * Math.cos(0.04 * tick),
];

const t = ({ tick }) => 0.01 * tick;

const count = 4 * N * N * 6;

const timeSamples = {
  width: N,
  height: 1,
  data: new Uint8Array(N),
};

const freqSamples = new Uint8Array(N);

type Props = {}

type State = {
  audio: string
};

const Container = styled.div`
  ${styles.container}
`;

const View = React.forwardRef((props, ref) => <Container {...props} innerRef={ref} />);

export default class Audio extends React.Component<Props, State> {
  state = {
    audio: 'loading',
  };

  onDone = ({ song }) => {
    const context = new AudioContext();
    const source = context // eslint-disable-line react/destructuring-assignment
      .createMediaElementSource(song);
    this.analyser = context.createAnalyser(); // eslint-disable-line react/destructuring-assignment
    source.connect(this.analyser);
    source.connect(context.destination); // eslint-disable-line react/destructuring-assignment
    this.song = song;
    this.setState({ audio: 'ready' });
  };

  play = () => {
    this.song.play();
    this.setState({ audio: 'playing' });
  }

  render() {
    const { audio } = this.state;
    return (
      <div>
        <button type="button" onClick={this.play} disabled={audio !== 'ready'}>
          {'Play'}
        </button>
        <ReglContainer View={View} contextProps={contextProps}>
          <Resource
            manifest={manifest}
            onDone={this.onDone}
          >
            {() => (
              <Texture
                data={data}
                radius={N}
                channels={1}
                min="linear"
                mag="linear"
                wrap="repeat"
              >
                {terrainTexture => (
                  <Texture
                    width={width}
                    height={1}
                    channels={4}
                    min="linear"
                    mag="linear"
                    wrap="repeat"
                  >
                    {colorTexture => (
                      <Frame
                        onFrame={({ tick, regl }) => {
                          // Clear background
                          regl.clear({
                            color: [0, 0, 0, 1],
                            depth: 1,
                          });

                          // Update texture
                          this.analyser.getByteFrequencyData(timeSamples.data);
                          terrainTexture.subimage(timeSamples, 0, tick % N);

                          // Update colors
                          this.analyser.getByteFrequencyData(freqSamples);
                          colorTexture.subimage(freqSamples);
                        }}
                      >
                        <Drawable
                          vert={vert}
                          frag={frag}
                          attributes={attributes}
                          uniforms={{
                            offsetRow,
                            terrain: terrainTexture,
                            projection,
                            view,
                            lightPosition,
                            color: colorTexture,
                            t,
                          }}
                          elements={null}
                          instances={-1}
                          count={count}
                        />
                      </Frame>
                    )}
                  </Texture>
                )}
              </Texture>
            )}
          </Resource>
        </ReglContainer>
      </div>
    );
  }
}
