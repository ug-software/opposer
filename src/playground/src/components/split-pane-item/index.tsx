import { forwardRef, } from "react";

export default forwardRef<HTMLDivElement, any>((props, ref) => {
  return <div ref={ref} {...props} />;
});