// @flow
import * as React from 'react';

import ReglRenderer from './Regl.renderer';
import { CONSTANTS } from './Regl.types';
import typeof { Context as GLContext } from './types';

export const Context = React.createContext();

export type MergeProps = (
  mergeProps: ((state: State, props: Props) => any) // eslint-disable-line no-use-before-define
) => void;

type Props = {
  renderer: typeof ReglRenderer,
  contextProps: {},
  innerRef: React.Ref<any>,
  children: React.Node
};

type State = {
  context: GLContext,
  mergeProps: MergeProps,
};

const CANVAS_VIEW_TYPE = 'canvas';

function getViewType(view) {
  switch (view.constructor) {
    case HTMLCanvasElement:
      return CANVAS_VIEW_TYPE;
    case WebGLRenderingContext:
      return 'gl';
    default:
      return 'container';
  }
}

export default (Container: React.ComponentType<any>) => class ReglProvider
  extends React.Component<Props, State> {
  static defaultProps = {
    renderer: ReglRenderer,
    mergeProps: null,
    innerRef: null,
    Canvas: null,
    children: null,
  }

  constructor(props: Props) {
    super(props);
    const Renderer = props.renderer;
    this.renderer = new Renderer();
    this.state = {
      context: this.renderer.createInstance(CONSTANTS.Regl, {}),
      mergeProps: mergeProps => this.setState(state => mergeProps(state, props)),
    };
  }

  initGLContext = (view: any) => {
    const { contextProps } = this.props;
    let { context } = this.state;
    if (context) context.destroy();
    const viewType = getViewType(view);
    if (viewType === CANVAS_VIEW_TYPE) {
      Object.assign(view, {
        width: view.hasAttribute('width') ? view.width : view.clientWidth,
        height: view.hasAttribute('height') ? view.height : view.clientHeight,
      });
    }
    context = this.renderer.createInstance(CONSTANTS.Regl, {
      ...contextProps,
      [getViewType(view)]: view,
    });
    this.setState({ context });
    return context;
  }

  renderer: typeof ReglRenderer;

  render() {
    const { innerRef, children, ...rest } = this.props;
    return (
      <Container
        {...rest}
        {...this.state}
        ref={innerRef}
        renderer={this.renderer}
        initGLContext={this.initGLContext}
      >
        <Context.Provider value={this.state}>
          {children}
        </Context.Provider>
      </Container>
    );
  }
};
