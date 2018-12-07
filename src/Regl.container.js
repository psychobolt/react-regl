// @flow
import * as React from 'react';
import * as ReactIs from 'react-is';
import _ from 'lodash';

import ReglRenderer from './Regl.renderer';
import ReglProvider from './Regl.provider'; // eslint-disable-line no-unused-vars
import typeof { Context } from './types';

type ContainerMountCallback = (context: Context) => any;

type Props = {
  onMount?: ContainerMountCallback,
  renderer: typeof ReglRenderer,
  context: Context,
  initGLContext: (canvasRef: mixed) => Context,
  viewProps: {
    ref: React.Ref<any>
  },
  View?: React.ElementType,
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
    const { viewProps, onMount } = props;
    this.onMount = _.once(context => {
      if (onMount) onMount(context);
    });
    this.viewRef = viewProps.ref || React.createRef();
  }

  componentDidMount() {
    const { renderer, context: ctx, initGLContext } = this.props;
    const context = this.viewRef.current ? initGLContext(this.viewRef.current) : ctx;
    this.mountNode = renderer.reconciler.createContainer(context);
  }

  componentDidUpdate() {
    const { renderer, context, children } = this.props;
    renderer.reconciler.updateContainer(children, this.mountNode, this, () => {
      this.onMount(context);
    });
    if (context) context.update();
  }

  componentWillUnmount() {
    const { renderer, context } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
    context.destroy();
  }

  onMount: ContainerMountCallback;

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
