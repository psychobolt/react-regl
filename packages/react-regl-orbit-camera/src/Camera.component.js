// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import * as ReactDOM from 'react-dom';
import { defaultMemoize } from 'reselect';
import rafSchedule from 'raf-schd';
import { identity, perspective, lookAt } from 'gl-mat4';

const { Context, Drawable } = ReactRegl;

const MIN_PHI = -Math.PI / 2.0;
const MAX_PHI = Math.PI / 2.0;
const FOVY = Math.PI / 4.0;
const right = new Float32Array([1, 0, 0]);
const front = new Float32Array([0, 0, 1]);

function damp(x) {
  const xd = x * 0.9;
  return Math.abs(xd) < 0.1 ? 0 : xd;
}

function clamp(x, lo, hi) {
  return Math.min(Math.max(x, lo), hi);
}

const logDistance = () => defaultMemoize(distance => Math.log(distance));

type Props = {
  /* eslint-disable react/no-unused-prop-types */
  center?: number[],
  theta?: number,
  phi?: number,
  distance?: number,
  up?: number[],
  /* eslint-enable react/no-unused-prop-types */
  minDistance?: number,
  maxDistance?: number,
  regl: Object,
  mergeProps: (mergeProps: ReactRegl.MergeProps) => any,
  children: React.Node
};

type State = {
  dtheta: number,
  dphi: number,
  ddistance: number,
  context: {
    view: Float32Array,
    projection: Float32Array | (context: any) => Float32Array,
    center: Float32Array,
    theta: number,
    phi: number,
    distance: number,
    eye: Float32Array,
    up: Float32Array,
  },
  uniforms?: {}
};

class Camera extends React.Component<Props, State> {
  updateRotation = rafSchedule(newState => ReactDOM
    .flushSync(() => this.setState(newState)));

  updateDistance = rafSchedule(newState => ReactDOM
    .flushSync(() => this.setState(newState)));

  logMinDistance = logDistance();

  logMaxDistance = logDistance();

  update = defaultMemoize((dtheta, dphi, ddistance) => {
    const { minDistance, maxDistance } = this.props;
    const { context } = this.state;
    let { theta, phi, distance, eye, view } = context;
    const r = Math.exp(distance);
    const vf = r * Math.sin(theta) * Math.cos(phi);
    const vr = r * Math.cos(theta) * Math.cos(phi);
    const vu = r * Math.sin(phi);
    theta += dtheta;
    phi = clamp(phi + dphi, MIN_PHI, MAX_PHI);
    distance = clamp(context.distance + ddistance,
      this.logMinDistance(minDistance), this.logMaxDistance(maxDistance));
    eye = eye
      .map((value, i) => context.center[i] + vf * front[i] + vr * right[i] + vu * context.up[i]);
    view = lookAt(identity(new Float32Array(view)), eye, context.center, context.up);
    this.setState({
      dtheta: damp(dtheta),
      dphi: damp(dphi),
      ddistance: damp(ddistance),
      context: {
        ...context,
        theta,
        phi,
        distance,
        eye,
        view,
      },
    });
  })

  static defaultProps = {
    center: [0.0, 0.0, 0.0],
    theta: 0,
    phi: 0,
    distance: 10,
    minDistance: 0.1,
    maxDistance: 1000,
    up: [0, 1, 0],
  }

  constructor(props: Props) {
    super(props);
    const { center = [0.0, 0.0, 0.0], theta = 0, phi = 0, distance = 10, up = [0, 1, 0] } = props;
    this.state = {
      ddistance: 0,
      dphi: 0,
      dtheta: 0,
      context: {
        center: new Float32Array(center),
        theta,
        phi,
        distance: Math.log(distance),
        up: new Float32Array(up),
        view: identity(new Float32Array(16)),
        projection: ({ viewportWidth, viewportHeight }) => perspective(
          identity(new Float32Array(16)),
          FOVY,
          viewportWidth / viewportHeight,
          0.1,
          1000,
        ),
        eye: new Float32Array(3),
      },
    };
  }

  componentDidMount() {
    const { mergeProps } = this.props;
    mergeProps(this.createHandlers);
    this.setState(({ context }, { regl }) => ({
      uniforms: Object.keys(context)
        .reduce((uniforms, name: string) => ({ ...uniforms, [name]: regl.context(name) }), {}),
    }));
  }

  componentDidUpdate() {
    const { dtheta, dphi, ddistance } = this.state;
    this.update(dtheta, dphi, ddistance);
  }

  componentWillUnmount() {
    this.updateRotation.cancel();
    this.updateDistance.cancel();
  }

  createHandlers = (state, { View }) => {
    const isElement = View instanceof Element;
    const mouseEventType: string = isElement ? 'onmousemove' : 'onMouseMove';
    const wheelEventType: string = isElement ? 'onwheel' : 'onWheel';
    return {
      viewProps: {
        [mouseEventType]: event => this.onMouseMove(isElement ? event : event.nativeEvent),
        [wheelEventType]: this.onWheel,
      },
    };
  }

  onMouseMove = (event: MouseEvent) => {
    const { buttons, movementX, movementY } = event;
    if (buttons === 1) {
      const dx = movementX / (event.target: any).clientWidth;
      const dy = movementY / (event.target: any).clientHeight;
      const { dtheta, dphi, context } = this.state;
      const w = Math.max(context.distance, 0.5);
      this.updateRotation({
        dtheta: dtheta + w * dx,
        dphi: dphi + w * dy,
      });
    }
  }

  onWheel = event => {
    let { ddistance } = this.state;
    ddistance += event.deltaY / (event.target: HTMLCanvasElement).clientHeight;
    this.updateDistance({ ddistance });
  }

  render() {
    const { context, uniforms } = this.state;
    const { children } = this.props;
    return children ? (
      <Drawable name="react_regl_orbit_camera" context={context} uniforms={uniforms}>
        {children}
      </Drawable>
    ) : null;
  }
}

export default React.forwardRef<Props, Camera>((props, ref) => (
  <Context.Consumer>
    {({ context, mergeProps }) => (
      <Camera {...props} ref={ref} regl={context?.regl} mergeProps={mergeProps} />
    )}
  </Context.Consumer>
));
