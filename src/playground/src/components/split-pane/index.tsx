import "./styles.css";
import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import React from "react";

interface WrapperDivProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

const Wrapper = forwardRef<HTMLDivElement, WrapperDivProps>(
  ({ children, ...otherProps }, ref) => {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const elementProps = child.props as React.HTMLAttributes<HTMLDivElement>;

            return React.cloneElement(child as React.ReactElement<any, any>, {
              ...elementProps,
              ...otherProps,
              ref,
            });
          }
          return child;
        })}
      </>
    );
  }
);

interface SplitPanelProps {
    children: ReactNode
}

export default ({ children } : SplitPanelProps) => {
    const [left, setLeft] = useState<ReactNode | null>(null)
    const [right, setRight] = useState<ReactNode | null>(null)

    const separator = useRef<HTMLButtonElement | null>(null);
    const paneElement = useRef<HTMLDivElement | null>(null);
    const leftElement = useRef<HTMLDivElement | null>(null);
    const rightElement = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if(Array.isArray(children)){
          const [primary, last] = children;
            setLeft(primary);
            setRight(last);
        }
    });

    useEffect(() => {
      let dragging = false;
      let x = 0;
      let xWidth = 0;
    
      const handleMouseDown = (e: MouseEvent) => {
        if (!leftElement.current){
          return null;
        };

        dragging = true;
        x = e.clientX;
        xWidth = leftElement.current.offsetWidth;
        document.body.style.userSelect = "none"; // evita seleção de texto
      };
    
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || !paneElement.current || !leftElement.current || !rightElement.current){
          return null;
        };
  
        const diff = e.clientX - x;
    
        leftElement.current.style.width = (xWidth + diff) + "px";
        rightElement.current.style.width = (paneElement.current.offsetWidth - (xWidth + diff)) + "px";
      };
    
      const handleMouseUp = () => {
        dragging = false;
        document.body.style.userSelect = "";
      };
    
      const sep = separator.current;
      if (sep) {
        sep.addEventListener("mousedown", handleMouseDown);
      }
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    
      return () => {
        if (sep) sep.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [separator]);

    return(
        <div ref={paneElement} className="wrapper-pane-split-component">
          <Wrapper 
            ref={leftElement}
          >
            {left}
          </Wrapper>

          <button
            className="panel-separator"
            ref={separator} 
          ></button>

          <Wrapper 
            ref={rightElement}
          >
            {right}
          </Wrapper>
        </div>
    );
}