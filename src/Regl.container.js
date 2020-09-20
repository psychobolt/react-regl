// @flow
import * as React from 'react';
import * as ReactIs from 'react-is';

import ReglProvider, { type Callback, type ContainerProps } from './Regl.provider';
import ReglRenderer from './Regl.renderer';

type Props = {
  renderer: typeof ReglRenderer,
  onRender?: Callback,
  View?: any,
} & ContainerProps;

export class ReglContainer extends React.Component<Props> {
  mountNode: any;

  viewRef: React.ElementRef<any>;

  static defaultProps = {
    onRender: () => {},
    View: null,
  }

  constructor(props: Props) {
    super(props);
    const { viewProps = {} } = props;
    this.viewRef = viewProps.ref || React.createRef();
  }

  componentDidMount() {
    const { View, renderer, initGLContext, context, onMount } = this.props;
    const view = this.viewRef.current || View;
    const glContext = initGLContext ? initGLContext(view) : context;
    if (glContext) {
      this.mountNode = renderer.reconciler.createContainer(glContext);
      if (onMount) onMount(glContext);
    }
  }

  componentDidUpdate() {
    const { View, viewProps, onRender, renderer, context, children } = this.props;
    if (View instanceof Element) {
      Object.assign(View, viewProps);
    }
    if (context) {
      renderer.reconciler.updateContainer(children, this.mountNode, this, () => {
        if (onRender) onRender(context);
      });
      context.update();
    }
  }

  componentWillUnmount() {
    const { renderer, context } = this.props;
    renderer.reconciler.updateContainer(null, this.mountNode, this);
    if (context) context.destroy();
  }

  render() {
    const { viewProps, View } = this.props;
    if (View && ReactIs.isValidElementType(View)) {
      return <View {...viewProps} ref={this.viewRef} />;
    }
    return null;
  }
}

export default ReglProvider<Props>(ReglContainer);
