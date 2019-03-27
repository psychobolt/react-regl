// @flow
import * as React from 'react';

import { CONSTANTS } from '../Regl.types';

type Props = {
  children: any => React.Node,
};

export default React.forwardRef(({ children, ...props }: Props, ref) => {
  const framebuffer = ref || React.useRef(null);
  const [mounted, setState] = React.useState(false);
  React.useLayoutEffect(() => setState(framebuffer.current !== null), []);
  return (
    <CONSTANTS.Framebuffer ref={framebuffer} {...props}>
      {mounted ? children(framebuffer.current.getInstance()) : null}
    </CONSTANTS.Framebuffer>
  );
});
