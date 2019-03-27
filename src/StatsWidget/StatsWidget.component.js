// @flow
import * as React from 'react';
import styled from 'styled-components';

import { Frame, Drawable, typeof Context } from '../types';
import * as styles from './StatsWidget.style';

const N = 50;

function collectDrawables(drawCalls, children) {
  children.forEach(child => {
    let { profile } = child.props;
    profile = typeof profile === 'undefined' || profile;
    if (profile) {
      if (child instanceof Drawable) {
        const instance = child.getInstance();
        if (instance.stats) {
          Object.assign(drawCalls, {
            [child.id]: {
              name: child.name,
              instance,
              totalFrameTime: 0,
              avgFrameTime: 0,
              prevGpuTimes: 0,
              ...drawCalls[child.id],
            },
          });
        }
      }
      collectDrawables(drawCalls, child.children);
    }
  });
}

const Container = styled.div`${styles.container}`;

const Stats = styled.div`${styles.stats}`;

type Props = {
  context: Context
}

type State = {
  frameTimeCount: number
}

export default class extends React.Component<Props, State> {
  drawCalls = {};

  // we update the widget every second, we need to keep track of the time:
  totalTime = 1.1

  state = {
    frameTimeCount: 0,
  }

  componentDidMount() {
    const { context } = this.props;
    const { children } = context;
    if (children.length === 1) {
      const child = children[0];
      if (child instanceof Frame) {
        const { draw } = child;
        child.draw = (args, ctx) => {
          draw.call(child, args, ctx);
          this.update(0.017);
        };
      }
    }
  }

  update = (deltaTime: number) => {
    const { context } = this.props;
    let { frameTimeCount } = this.state;
    this.totalTime += deltaTime;
    if (this.totalTime > 1.0) {
      this.totalTime = 0;
    }
    frameTimeCount += 1;

    collectDrawables(this.drawCalls, context.children);

    Object.values(this.drawCalls).forEach(drawCall => {
      const { gpuTime } = drawCall.instance.stats;
      let { prevGpuTimes, totalFrameTime, avgFrameTime } = drawCall;
      const frameTime = gpuTime - prevGpuTimes;
      totalFrameTime += frameTime;

      if (frameTimeCount === N) {
        avgFrameTime = drawCall.totalFrameTime / N;
        totalFrameTime = 0.0;
      }

      prevGpuTimes = gpuTime;

      Object.assign(drawCall, {
        totalFrameTime,
        avgFrameTime,
        prevGpuTimes,
      });
    });

    // reset avg calculation
    if (frameTimeCount === N) {
      frameTimeCount = 0;
    }
    this.setState({ frameTimeCount });
  }

  render() {
    const { drawCalls } = this;
    return (
      <Container>
        <h1>Stats</h1>
        {Object.values(drawCalls).map(({ name, avgFrameTime }, index) => (
          <Stats key={`stats_${index + 1}`}>{`${name}: ${Math.round(100.0 * avgFrameTime) / 100}ms`}</Stats>
        ))}
      </Container>
    );
  }
}
