// @flow
import * as React from 'react';
import * as ReactRegl from '@psychobolt/react-regl';
import type { ContainerProps } from '@psychobolt/react-regl';

import MultiReglRenderer from './MultiRegl.renderer';

const { ReglContainer } = ReactRegl;

type Props = {
  viewCount?: number,
  viewProps?: {
    ref: React.Ref<any>
  },
} & ContainerProps;

type State = {
  mounted: boolean
};

export default class extends React.Component<Props, State> {
  views = [];

  viewProps: {}

  static defaultProps = {
    viewCount: -1,
    viewProps: {},
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

  render() {
    const { viewProps, children, ...props } = this.props;
    const { mounted } = this.state;
    return (
      <ReglContainer renderer={MultiReglRenderer} {...props} viewProps={this.viewProps}>
        {mounted && typeof children === 'function' ? children(this.views) : children}
      </ReglContainer>
    );
  }
}
