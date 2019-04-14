// @flow
import * as React from 'react';
import * as ReactIs from 'react-is';

import ReglRenderer from './Regl.renderer';
import ReglProvider from './Regl.provider'; // eslint-disable-line no-unused-vars
import typeof { Context } from './types';

type Callback = (context: Context) => any;

type Props = {
  onMount?: Callback,
  onRender: Callback,
  renderer: typeof ReglRenderer,
  context: Context,
  initGLContext: (canvas: mixed) => Context,
  viewProps: {
    ref: React.Ref<any>
  },
  View?: React.ElementType | typeof WebGLRenderingContext | typeof Element,
  children?: React.Node
};

// $FlowFixMe
@ReglProvider
export default class ReglContainer extends React.Component<Props> {
  static defaultProps = {
    onMount: () => {},
    View: null,
    children: null,
  };

  constructor(props: Props) {
    super(props);
    const { viewProps } = props;
    this.viewRef = viewProps.ref || React.createRef();
  }

  componentDidMount() {
    const { View, renderer, initGLContext, onMount } = this.props;
    const view = this.viewRef.current || View;
    const context = initGLContext(view);
    this.mountNode = renderer.reconciler.createContainer(context);
    if (onMount) onMount(context);
  }

  componentDidUpdate() {
    const { View, viewProps, onRender, renderer, context, children } = this.props;
    if (View instanceof Element) {
      Object.assign(View, viewProps);
    }
    renderer.reconciler.updateContainer(children, this.mountNode, this, () => onRender(context));
    if (context) context.update();
  }

  componentWillUnmount() {
    const { renderer, context } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
    context.destroy();
  }

  mountNode: any;

  viewRef: React.Ref<any>;

  render() {
    const { viewProps, View } = this.props;
    if (View && ReactIs.isValidElementType(View)) {
      return <View {...viewProps} ref={this.viewRef} />;
    }
    return null;
  }
}
