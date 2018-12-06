// @flow
import * as React from 'react';
import { defaultMemoize } from 'reselect';

import ReglRenderer from './Regl.renderer';
import { CONSTANTS } from './Regl.types';
import { VIEW_TYPE, typeof Context as GLContext } from './types';

export const Context = React.createContext<any>();

export type MergeProps = (
  mergeProps: ((state: State, props: Props) => any) // eslint-disable-line no-use-before-define
) => void;

type Props = {
  renderer: typeof ReglRenderer,
  viewProps: {},
  contextProps: {},
  innerRef: React.Ref<any>,
  View: React.ElementType,
  children: React.Node
};

type State = {
  context: GLContext,
  viewProps?: {},
  contextProps?: {},
  mergeProps: MergeProps,
  mounted: boolean,
};

const getMergeProps = () => (state, props) => ({
  ...props,
  ...state,
});

function getViewType(view) {
  switch (view.constructor) {
    case HTMLCanvasElement:
      return VIEW_TYPE.Canvas;
    case WebGLRenderingContext:
      return VIEW_TYPE.GL;
    default:
      return VIEW_TYPE.Container;
  }
}

export default (Container: React.ComponentType<any>) => class ReglProvider
  extends React.Component<Props, State> {
  mergeViewProps = defaultMemoize(getMergeProps());

  mergeContextProps = defaultMemoize(getMergeProps());

  static defaultProps = {
    renderer: ReglRenderer,
    contextProps: {},
    mergeProps: null,
    innerRef: null,
    children: null,
  }

  constructor(props: Props) {
    super(props);
    const Renderer = props.renderer;
    this.renderer = new Renderer();
    this.state = {
      context: this.renderer.createInstance(CONSTANTS.Regl, props.contextProps),
      mergeProps: mergeProps => this.setState(state => mergeProps(state, props)),
      mounted: false,
    };
  }

  componentDidMount() {
    const { View } = this.props;
    if (!View) {
      this.setState({ mounted: true });
    }
  }

  initGLContext = (view: any) => {
    const { contextProps } = this.props;
    let { context } = this.state;
    if (context) context.destroy();
    const viewType = getViewType(view);
    if (viewType === VIEW_TYPE.Canvas) {
      Object.assign(view, {
        width: view.hasAttribute('width') ? view.width : view.clientWidth,
        height: view.hasAttribute('height') ? view.height : view.clientHeight,
      });
    }
    context = this.renderer.createInstance(CONSTANTS.Regl, {
      ...contextProps,
      [getViewType(view)]: view,
    });
    this.setState({ context, mounted: true });
    return context;
  }

  renderer: typeof ReglRenderer;

  render() {
    const { innerRef, children, viewProps, contextProps, ...rest } = this.props;
    const { viewProps: viewState, contextProps: contextState, mounted, ...state } = this.state;
    return (
      <Container
        {...rest}
        {...state}
        viewProps={this.mergeViewProps(viewState, viewProps)}
        contextProps={this.mergeContextProps(contextState, contextProps)}
        ref={innerRef}
        renderer={this.renderer}
        initGLContext={this.initGLContext}
      >
        {mounted && (
          <Context.Provider value={state}>
            {children}
          </Context.Provider>
        )}
      </Container>
    );
  }
};
