// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import getusermedia from 'getusermedia';
import { AudioContext } from 'standardized-audio-context';

import vert from './Microphone.vert';
import frag from './Microphone.frag';

const { ReglContainer, Frame, Drawable, Types } = ReactRegl;

type Props = {};

type State = {
  fftSize: number
};

export default class Microphone extends React.Component<Props, State> {
  fftBuffer = null;

  state = {
    fftSize: 0,
  }

  componentWillUnmount() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }

  onMount = ({ regl }: Types.Context) => {
    if (!navigator) return;

    // First we need to get permission to use the microphone
    if (navigator.getUserMedia) {
      getusermedia({ audio: true }, (err, stream) => {
        if (err) return;
        this.createAudioContext(regl, stream);
      });
    } else if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => this.createAudioContext(regl, stream));
    }
  }

  onFrame = ({ regl }: Types.Context) => {
    // Clear draw buffer
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    });

    // Poll microphone data
    if (this.analyser) this.analyser.getByteFrequencyData(this.frequencies);

    // Here we use .subdata() to update the buffer in place
    if (this.fftBuffer) this.fftBuffer.subdata(this.frequencies);
  }

  audioContext: AudioContext;

  analyser: AnalyserNode;

  frequencies: Uint8Array;

  createAudioContext(regl: any, stream: MediaStream) {
    // Create an analyser node to intercept data from the mic
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();

    // And then we connect them together
    if (this.audioContext) this.audioContext.createMediaStreamSource(stream).connect(this.analyser);

    // Here we preallocate buffers for streaming audio data
    const fftSize = this.analyser.frequencyBinCount;
    this.frequencies = new Uint8Array(fftSize);
    this.fftBuffer = regl.buffer({
      length: fftSize,
      type: 'uint8',
      usage: 'dynamic',
    });
    this.stream = stream;

    this.setState({ fftSize });
  }

  stream: any

  render() {
    const { fftSize } = this.state;
    return (
      <ReglContainer onMount={this.onMount}>
        {fftSize > 0 && (
          <Frame onFrame={this.onFrame}>
            <Drawable
              vert={vert}
              frag={frag}
              uniforms={{
                FFT_SIZE: fftSize,
                PI: Math.PI,
              }}
              attributes={{
                index: Array(fftSize).fill().map((_, i) => i),
                frequency: {
                  buffer: this.fftBuffer,
                  normalized: true,
                },
              }}
              elements={null}
              instances={-1}
              lineWidth={1}
              depth={{ enable: false }}
              count={fftSize}
              primitive="line loop"
            />
          </Frame>
        )}
      </ReglContainer>
    );
  }
}
