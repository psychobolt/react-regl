// @flow
import * as React from 'react';

import typeof { Cube as CubeType } from '../types';
import { CONSTANTS } from '../Regl.types';

type Props = {
  children?: CubeType => React.Node,
  innerRef: React.Ref<CubeType>,
};

type State = {
  ref: CubeType
}

class Cube extends React.Component<Props, State> {
  static defaultProps = {
    children: () => null,
  }

  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef();
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

  ref: React.Ref<CubeType>

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

export default React.forwardRef((props, ref) => <Cube {...props} innerRef={ref} />);
