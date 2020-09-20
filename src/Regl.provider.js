// @flow
import * as React from 'react';
import { defaultMemoize } from 'reselect';
import _ from 'lodash';

import ReglRenderer from './Regl.renderer';
import { CONSTANTS } from './Regl.types';
import { VIEW_TYPE, Context as ContextType } from './types';

export type MergeProps =
  (state: State, props: Props) => any // eslint-disable-line no-use-before-define

type ProviderContext = {
  context: ContextType,
  mergeProps: (mergeProps: MergeProps) => void
}

export const Context = React.createContext<ProviderContext>({});

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

export type Callback = (context: ContextType) => any;

export type ContainerProps = {
  renderer?: typeof ReglRenderer,
  onMount?: Callback,
  onRender?: Callback,
  View?: any,
  viewProps?: {},
  contextProps?: {},
  context?: ?ContextType,
  initGLContext?: any => ?ContextType,
  children?: React.Node
}

type Props = {
  innerRef?: React.Ref<any>,
  statsWidget?: boolean,
} & ContainerProps;

type State = {
  context: ?ContextType,
  mergeProps: (mergeProps: MergeProps) => any,
  viewProps?: {},
  contextProps?: {},
  mounted: boolean,
  rendered: boolean,
};

export default <T>(Container: React.ComponentType<T | ContainerProps>) => class ReglProvider
  extends React.Component<Props, State> {
  mergeViewProps = defaultMemoize(getMergeProps());

  mergeContextProps = defaultMemoize(getMergeProps());

  static defaultProps = {
    onMount: () => {},
    onRender: () => {},
    renderer: ReglRenderer,
    View: null,
    viewProps: {},
    context: null,
    initGLContext: () => null,
    contextProps: {},
    innerRef: React.createRef<React.Component<ContainerProps>>(),
    statsWidget: false,
    children: null,
  }

  constructor(props: Props) {
    super(props);
    const Renderer = props.renderer;
    this.renderer = Renderer ? new Renderer() : new ReglRenderer();
    this.state = {
      context: props.context,
      mergeProps: (mergeProps: Function) => this.setState(state => mergeProps(state, props)),
      mounted: false,
      rendered: false,
    };
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  onRender = _.once((context: ContextType) => {
    const { onRender } = this.props;
    if (onRender) onRender(context);
    this.setState({ rendered: true });
  })

  initGLContext = (view: any) => {
    const { contextProps } = this.props;
    const viewType: ?string = getViewType(view);
    if (viewType === VIEW_TYPE.Canvas) {
      Object.assign(view, {
        width: view.hasAttribute('width') ? view.width : view.clientWidth,
        height: view.hasAttribute('height') ? view.height : view.clientHeight,
      });
    }
    const context = this.renderer.createInstance(CONSTANTS.Regl, {
      ...(contextProps: any),
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
    const providerValue: any = state;
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
            <Context.Provider value={providerValue}>
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
