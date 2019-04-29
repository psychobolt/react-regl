// @flow
import * as React from 'react';

import { CONSTANTS } from '../Regl.types';
import { Framebuffer } from '../types';

type Props = {
  children: any => React.Node,
};

export default React.forwardRef<Props, Framebuffer>(({ children, ...props }: Props, ref) => {
  const framebuffer = ref || React.createRef<Framebuffer>();
  const [mounted, setState] = React.useState(false);
  React.useLayoutEffect(() => setState(framebuffer.current !== null), []);
  return (
    <CONSTANTS.Framebuffer ref={framebuffer} {...props}>
      {mounted && framebuffer.current ? children(framebuffer.current.getInstance()) : null}
    </CONSTANTS.Framebuffer>
  );
});
