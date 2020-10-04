// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import styled from 'styled-components';
import { AudioContext } from 'standardized-audio-context';
import perspective from 'gl-mat4/perspective';
import lookAt from 'gl-mat4/lookAt';

import * as styles from './Audio.style';
import vert from './Audio.vert';
import frag from './Audio.frag';
import mp3 from './8bitpeoples-bamboo-cactus.mp3';

const { ReglContainer, Resource, Texture, Frame, Drawable } = ReactRegl;

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

type TimeSamples = {
  width: number,
  height: number,
  data: Uint8Array,
}

type Props = {};

type State = {
  audio: string
};

const View = styled.div`
  ${styles.container}
`;

const STATES = {
  Ready: 'ready',
  Playing: 'playing',
};

export default class Audio extends React.Component<Props, State> {
  timeSamples: TimeSamples = {
    width: N,
    height: 1,
    data: new Uint8Array(N),
  };

  freqSamples: Uint8Array = new Uint8Array(N);

  source: any

  analyser: any

  song: any

  constructor(props: Props) {
    super(props);
    this.state = {
      audio: 'loading',
    };
  }

  componentWillUnmount() {
    const { audio } = this.state;
    if (audio === STATES.Playing) this.song.pause();
    if (this.source) this.source.disconnect();
  }

  onDone: (options: { song: any }) => void = ({ song }) => {
    this.song = song;
    this.song.loop = true;
    this.setState({ audio: STATES.Ready });
  };

  play: () => void = () => {
    const context = new AudioContext();
    const source = context.createMediaElementSource(this.song);
    const analyser = context.createAnalyser();
    source.connect(analyser);
    source.connect(context.destination);
    this.source = source;
    this.analyser = analyser;
    this.song.play().then(() => {
      this.setState({ audio: STATES.Playing });
    });
  }

  render(): React.Node {
    const { audio } = this.state;
    return (
      <div>
        <button type="button" onClick={this.play} disabled={audio !== STATES.Ready}>Play</button>
        <ReglContainer View={View} contextProps={contextProps}>
          <Resource
            manifest={manifest}
            onDone={this.onDone}
          >
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

                        const { audio: state } = this.state;
                        if (state === STATES.Playing) {
                          // Update texture
                          this.analyser.getByteFrequencyData(this.timeSamples.data);
                          terrainTexture.subimage(this.timeSamples, 0, tick % N);

                          // Update colors
                          this.analyser.getByteFrequencyData(this.freqSamples);
                          colorTexture.subimage(this.freqSamples);
                        }
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
          </Resource>
        </ReglContainer>
      </div>
    );
  }
}
