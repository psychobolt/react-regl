// @flow
import * as React from 'react';

import { Texture as TextureType } from '../types';
import { CONSTANTS } from '../Regl.types';

type Ref<T> = { current: null | T } | (current: null | T) => mixed;

type Props = {
  children: TextureType => React.Node,
  innerRef: Ref<TextureType>,
};

type State = {
  ref: ?TextureType
}

class Texture extends React.Component<Props, State> {
  ref: Ref<TextureType>

  constructor(props: Props) {
    super(props);
    this.ref = props.innerRef || React.createRef<TextureType>();
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
    if (this.ref.current) {
      this.ref.current.update();
    }
  }

  render() {
    const { children, innerRef, ...props } = this.props;
    const { ref: texture } = this.state;
    return (
      <CONSTANTS.Texture ref={this.ref} {...props}>
        {texture && children ? children(texture.getInstance()) : null}
      </CONSTANTS.Texture>
    );
  }
}

export default React.forwardRef<Props, TextureType>(
  (props, ref) => <Texture {...props} innerRef={ref} />,
);
