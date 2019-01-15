// @flow
import * as React from 'react';
import resl from 'resl';

import { Collection } from '../Regl.types';

type Assets = {};

type Props = {
  onDone?: (assets: Assets) => any,
  children?: (assets: Assets) => React.Node,
  innerRef?: React.Ref<typeof Collection>,
};

type State = {
  assets: ?Assets,
};

class Resl extends React.Component<Props, State> {
  static defaultProps = {
    onDone: () => {},
    children: () => null,
    innerRef: React.createRef(),
  }

  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef<typeof Collection>();
  }

  state = {
    assets: null,
  }

  componentDidMount() {
    const { children, innerRef, ...props } = this.props;
    resl({
      ...props,
      onDone: this.onDone,
    });
  }

  componentDidUpdate() {
    if (this.ref.current) {
      this.ref.current.update();
    }
  }

  onDone = (assets: Assets) => {
    const { onDone } = this.props;
    onDone(assets);
    this.setState({ assets });
  }

  ref: React.Ref<CubeType>

  render() {
    const { children } = this.props;
    const { assets } = this.state;
    if (assets) {
      return (
        <Collection ref={this.ref}>
          {typeof children === 'function' ? children(assets) : children}
        </Collection>
      );
    }
    return null;
  }
}

export default React.forwardRef((props, ref) => <Resl {...props} innerRef={ref} />);
