// @flow
import * as React from 'react';
import styled from 'styled-components';

import { Frame, Drawable, Context } from '../types';
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

function updateDrawCalls(oldDrawCalls, newDrawCalls) {
  return Object.keys(oldDrawCalls).reduce((drawCalls, key) => ({
    ...drawCalls,
    [key]: {
      ...oldDrawCalls[key],
      ...newDrawCalls[key],
    },
  }), {});
}

const Container = styled.div`${styles.container}`;

const Stats = styled.div`${styles.stats}`;

type Props = {
  context: Context
}

type State = {
  drawCalls: {},
  frameTimeCount: number
}

export default class extends React.Component<Props, State> {
  // we update the widget every second, we need to keep track of the time:
  totalTime = 1.1

  constructor(props) {
    super(props);
    this.state = {
      drawCalls: {},
      frameTimeCount: 0,
    };
  }

  componentDidMount() {
    const { context } = this.props;
    const { children } = context;
    if (children.length === 1) {
      const child = children[0];
      if (child instanceof Frame) {
        child.overrideUpdate(({ draw }) => {
          draw();
          this.update(0.017);
        });
      }
    }
  }

  update = (deltaTime: number) => {
    const { context } = this.props;
    let { frameTimeCount, drawCalls } = this.state;
    this.totalTime += deltaTime;
    if (this.totalTime > 1.0) {
      this.totalTime = 0;
    }
    frameTimeCount += 1;
    const newDrawCalls = {};
    collectDrawables(newDrawCalls, context.children);
    drawCalls = updateDrawCalls(newDrawCalls, drawCalls);

    (Object.values(drawCalls): any).forEach(drawCall => {
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
    this.setState({ frameTimeCount, drawCalls });
  }

  render() {
    const { drawCalls } = this.state;
    return (
      <Container>
        <h1>Stats</h1>
        {(Object.values(drawCalls): any).map(({ name, avgFrameTime }, index) => (
          <Stats key={`stats_${index + 1}`}>{`${name}: ${Math.round(100.0 * avgFrameTime) / 100}ms`}</Stats>
        ))}
      </Container>
    );
  }
}
