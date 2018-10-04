// @flow
import * as React from 'react';

import ReglRenderer from './Regl.renderer';
import ReglProvider from './Regl.provider'; // eslint-disable-line no-unused-vars
import typeof { Context } from './types';

type Props = {
  onMount?: (context: Context) => any,
  renderer: typeof ReglRenderer,
  context: Context,
  initGLContext: (canvasRef: mixed) => Context,
  viewProps: {},
  View?: React.ElementType,
  children?: React.Node
};

// $FlowFixMe
export default @ReglProvider class ReglContainer extends React.Component<Props> {
  static defaultProps = {
    onMount: () => {},
    View: null,
    children: null,
  };

  constructor(props: Props) {
    super(props);
    this.viewRef = React.createRef();
  }

  componentDidMount() {
    const { renderer, context: ctx, initGLContext, onMount } = this.props;
    const context = this.viewRef.current ? initGLContext(this.viewRef.current) : ctx;
    this.mountNode = renderer.reconciler.createContainer(context);
    if (onMount) onMount(context);
  }

  componentDidUpdate() {
    const { renderer, context, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this);
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
    if (View) {
      return <View {...viewProps} ref={this.viewRef} />;
    }
    return null;
  }
}
