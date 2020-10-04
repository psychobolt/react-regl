// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import type { ContainerProps } from '@psychobolt/react-regl';

import MultiReglRenderer from './MultiRegl.renderer';

const { ReglRenderer, ReglContainer } = ReactRegl;

type Props = {
  renderer?: typeof ReglRenderer,
  viewCount?: number,
  viewProps?: {
    ref: React.Ref<any>
  },
} & ContainerProps;

type State = {
  mounted: boolean
};

export default class extends React.Component<Props, State> {
  views: Array<Element> = [];

  viewProps: {}

  static defaultProps: Props = {
    viewCount: -1,
    viewProps: {},
    renderer: MultiReglRenderer,
  }

  constructor(props: Props) {
    super(props);
    const { viewCount = 0, viewProps = {} } = this.props;
    this.viewProps = {
      ...viewProps,
      ref: view => {
        if (typeof viewProps.ref === 'function') viewProps.ref(view);
        this.views.push(view);
        if (this.views.length >= viewCount) {
          this.setState({ mounted: true });
        }
      },
    };
    this.state = {
      mounted: false,
    };
  }

  render(): React.Node {
    const { viewProps, children, ...props } = this.props;
    const { mounted } = this.state;
    return (
      <ReglContainer renderer={MultiReglRenderer} {...props} viewProps={this.viewProps}>
        {mounted && typeof children === 'function' ? children(this.views) : children}
      </ReglContainer>
    );
  }
}
