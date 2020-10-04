// @flow
import * as React from 'react';

const forwardRef = (Component: React.AbstractComponent<any>): React.AbstractComponent<any> => React
  .forwardRef<any, any>((props, ref) => <Component {...props} innerRef={ref} />);

export default (
  Component: React.AbstractComponent<any>,
): React.AbstractComponent<any> => forwardRef(
  ({ children, innerRef, ...props }: any) => {
    const ref = innerRef || React.useRef(null);
    const [drawable, setDrawable] = React.useState(ref.current);
    React.useEffect(() => {
      if (ref.current) {
        ref.current.update();
        setDrawable(ref.current);
      }
    });
    return (
      <Component {...props} ref={ref}>
        {drawable ? children(drawable.getInstance()) : null}
      </Component>
    );
  },
);
