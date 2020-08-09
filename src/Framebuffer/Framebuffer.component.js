// @flow
import * as React from 'react';

import { CONSTANTS } from '../Regl.types';
import { Framebuffer } from '../types';

type Props = {
  children: any => React.Node,
};

export default React.forwardRef<Props, Framebuffer>(({ children, ...props }: Props, ref) => {
  const framebuffer = ref || React.useRef<Framebuffer | null>(null);
  const [mounted, setState] = React.useState(false);
  React.useLayoutEffect(() => setState((framebuffer: any).current !== null), []);
  return (
    <CONSTANTS.Framebuffer {...props} ref={framebuffer}>
      {mounted && framebuffer.current ? children((framebuffer: any).current.getInstance()) : null}
    </CONSTANTS.Framebuffer>
  );
});
