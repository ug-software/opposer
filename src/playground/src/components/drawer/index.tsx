import { type ReactNode } from "react";
import { Drawer } from "./styles";


export default ({ children, open } : { children:  ReactNode, open: boolean }) => {
    return(
        <Drawer 
            variant="permanent"
            anchor="left" 
            open={open}
        >
            
            {children}
        </Drawer>
    );
}