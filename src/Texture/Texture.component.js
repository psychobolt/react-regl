// @flow
import * as React from 'react';

import typeof { Texture as TextureType } from '../types';
import { CONSTANTS } from '../Regl.types';

type Props = {
  children: texture => React.ReactNode,
  innerRef: React.RefObject<any>,
};

type State = {
  ref: TextureType
}

class Texture extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
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

  ref = (current?: TextureType) => {
    const { innerRef } = this.props;
    innerRef(current);
    this.ref(current);
  }

  render() {
    const { children, ...props } = this.props;
    const { ref: texture } = this.state;
    return (
      <React.Fragment>
        {texture ? children(texture.instance) : null}
        <CONSTANTS.Texture ref={this.ref} {...props} />
      </React.Fragment>
    );
  }
}

export default React.forwardRef((props, ref) => <Texture {...props} innerRef={ref} />);
