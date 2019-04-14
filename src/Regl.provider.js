// @flow
import * as React from 'react';
import { defaultMemoize } from 'reselect';
import _ from 'lodash';

import ReglRenderer from './Regl.renderer';
import { CONSTANTS } from './Regl.types';
import { VIEW_TYPE, typeof Context as GLContext } from './types';

export type MergeProps = (
  mergeProps: (state: State, props?: Props) => void // eslint-disable-line no-use-before-define
) => void;

type ReglContext = {
  context: GLContext,
  mergeProps: (mergeProps: MergeProps) => any
}

export const Context = React.createContext<ReglContext>({});

const getMergeProps = () => (state, props) => ({
  ...props,
  ...state,
});

function getViewType(view) {
  if (!view) return null;
  switch (view.constructor?.name) {
    case 'HTMLCanvasElement':
      return VIEW_TYPE.Canvas;
    case 'WebGLRenderingContext':
      return VIEW_TYPE.GL;
    default:
      return VIEW_TYPE.Container;
  }
}

const StatsWidget = React.lazy(() => import('./StatsWidget'));

type Props = {
  onRender?: (context: GLContext) => any,
  renderer?: typeof ReglRenderer,
  viewProps?: {},
  contextProps?: {},
  innerRef?: React.Ref<any>,
  statsWidget?: boolean,
  children?: React.Node
};

type State = {
  context: GLContext,
  mergeProps: (mergeProps: MergeProps) => any,
  viewProps?: {},
  contextProps?: {},
  mounted: boolean,
  rendered: boolean,
};

export default (Container: React.ComponentType<any>) => class ReglProvider
  extends React.Component<Props, State> {
  mergeViewProps = defaultMemoize(getMergeProps());

  mergeContextProps = defaultMemoize(getMergeProps());

  static defaultProps = {
    onRender: () => {},
    renderer: ReglRenderer,
    viewProps: {},
    contextProps: {},
    innerRef: null,
    statsWidget: false,
    children: null,
  }

  constructor(props: Props) {
    super(props);
    const Renderer = props.renderer;
    this.renderer = Renderer ? new Renderer() : new ReglRenderer();
    this.state = {
      context: null,
      mergeProps: (mergeProps: Function) => this.setState(state => mergeProps(state, props)),
      mounted: false,
      rendered: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onRender = _.once((context: GLContext) => {
    const { onRender } = this.props;
    if (onRender) onRender(context);
    this.setState({ rendered: true });
  })

  initGLContext = (view: any) => {
    const { contextProps } = this.props;
    const viewType = getViewType(view);
    if (viewType === VIEW_TYPE.Canvas) {
      Object.assign(view, {
        width: view.hasAttribute('width') ? view.width : view.clientWidth,
        height: view.hasAttribute('height') ? view.height : view.clientHeight,
      });
    }
    const context = this.renderer.createInstance(CONSTANTS.Regl, {
      ...contextProps,
      ...(viewType ? { [viewType]: view } : undefined),
    });
    this.setState({ context });
    return context;
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
