// @flow
import * as React from 'react';

import { Cube as CubeType } from '../types';
import { CONSTANTS } from '../Regl.types';

type Ref<T> = { current: null | T } | (current: null | T) => mixed;

type Props = {
  children: CubeType => React.Node,
  innerRef: Ref<CubeType>,
};

type State = {
  ref: ?CubeType
}

class Cube extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef<CubeType>();
  }

  state = {
    ref: null,
  }

  componentDidMount() {
    const ref = this.ref.current;
    if (ref) {
      this.setState({ ref });
    }
  }

  componentDidUpdate() {
    const ref = this.ref.current;
    if (ref) {
      ref.update();
    }
  }

  ref: Ref<CubeType>

  render() {
    const { children, innerRef, ...props } = this.props;
    const { ref: cube } = this.state;
    return (
      <CONSTANTS.Cube ref={this.ref} {...props}>
        {cube ? children(cube.getInstance()) : null}
      </CONSTANTS.Cube>
    );
  }
}

export default React.forwardRef<Props, CubeType>(
  (props, ref) => <Cube {...props} innerRef={ref} />,
);
