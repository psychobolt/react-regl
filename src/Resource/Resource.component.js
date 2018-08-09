// @flow
import * as React from 'react';
import resl from 'resl';

type Assets = {};

type Props = {
  onDone?: (assets: Assets) => any,
  children: (assets: Assets) => React.ReactNode,
};

type State = {
  assets: ?Assets,
};

export default class Resl extends React.Component<Props, State> {
  static defaultProps = {
    onDone: () => {},
  }

  state = {
    assets: null,
  }

  componentDidMount() {
    const { children, ...props } = this.props;
    resl({
      ...props,
      onDone: this.onDone,
    });
  }

  onDone = (assets: Assets) => {
    const { onDone } = this.props;
    onDone(assets);
    this.setState({ assets });
  }

  render() {
    const { children } = this.props;
    const { assets } = this.state;
    if (assets) return children(assets);
    return null;
  }
}
