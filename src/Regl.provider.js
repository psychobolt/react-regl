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

type Callback = (context: Context) => any;

type Props = {
  onRender?: Callback,
  renderer?: typeof ReglRenderer,
  viewProps: {},
  contextProps?: {},
  innerRef?: React.Ref<any>,
  statsWidget: boolean,
  View: React.ElementType,
  children?: React.Node
};

type State = {
  context: GLContext,
  viewProps?: {},
  contextProps?: {},
  mergeProps: MergeProps,
  mounted: boolean,
  rendered: boolean,
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

const StatsWidget = React.lazy(() => import('./StatsWidget'));

export default (Container: React.ComponentType<any>) => class ReglProvider
  extends React.Component<Props, State> {
  mergeViewProps = defaultMemoize(getMergeProps());

  mergeContextProps = defaultMemoize(getMergeProps());

  static defaultProps = {
    onRender: () => {},
    renderer: ReglRenderer,
    contextProps: {},
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
      rendered: false,
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

  onRender = (context: GLContext) => {
    const { onRender } = this.props;
    if (onRender) onRender(context);
    this.setState({ rendered: true });
  }

  renderer: typeof ReglRenderer;

  render() {
    const { innerRef, statsWidget, children, viewProps, contextProps, ...rest } = this.props;
    const {
      viewProps: viewState,
      contextProps: contextState,
      mounted,
      rendered,
      ...state
    } = this.state;
    const { context } = state;
    return (
      <>
        <Container
          {...rest}
          {...state}
          viewProps={this.mergeViewProps(viewState, viewProps)}
          contextProps={this.mergeContextProps(contextState, contextProps)}
          ref={innerRef}
          onRender={this.onRender}
          renderer={this.renderer}
          initGLContext={this.initGLContext}
        >
          {mounted && (
            <Context.Provider value={state}>
              {children}
            </Context.Provider>
          )}
        </Container>
        {rendered && statsWidget && (
          <React.Suspense fallback={null}><StatsWidget context={context} /></React.Suspense>
        )}
      </>
    );
  }
};
