// @flow
import * as React from 'react';
import resl from 'resl';

import { CONSTANTS } from '../Regl.types';
import { Collection as CollectionType } from '../types';

type Ref<T> = { current: null | T } | (current: null | T) => mixed;

type Assets = {};

type Props = {
  onDone: (assets: Assets) => any,
  children?: (assets: Assets) => React.Node,
  innerRef: Ref<CollectionType<any>>,
};

type State = {
  assets: ?Assets,
};

class Resl extends React.Component<Props, State> {
  static defaultProps = {
    children: () => null,
  }

  ref: Ref<CollectionType<any>>

  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef<CollectionType<any>>();
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
    if (onDone) onDone(assets);
    this.setState({ assets });
  }

  render() {
    const { children } = this.props;
    const { assets } = this.state;
    if (assets) {
      return (
        <CONSTANTS.Collection ref={this.ref}>
          {typeof children === 'function' ? children(assets) : children}
        </CONSTANTS.Collection>
      );
    }
    return null;
  }
}

export default React.forwardRef<Props, CollectionType<any>>(
  (props, ref) => <Resl {...props} innerRef={ref} />,
);
