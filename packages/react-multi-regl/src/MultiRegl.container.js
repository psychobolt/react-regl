// @flow
import * as React from 'react';
import { ReglContainer } from '@psychobolt/react-regl';

import MultiReglRenderer from './MultiRegl.renderer';

type Props = {
  viewCount?: number,
  viewProps?: {},
  children: React.Node | HTMLElement[] => React.Node
};

type State = {
  mounted: boolean
};

export default class extends React.Component<Props, State> {
  static defaultProps = {
    viewCount: -1,
    viewProps: {},
  }

  views = [];

  state = {
    mounted: false,
  }

  constructor(props) {
    super(props);
    const { viewCount, viewProps } = this.props;
    this.viewProps = {
      ...viewProps,
      ref: view => {
        if (viewProps.ref) viewProps.ref(view);
        this.views.push(view);
        if (this.views.length >= viewCount) {
          this.setState({ mounted: true });
        }
      },
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
