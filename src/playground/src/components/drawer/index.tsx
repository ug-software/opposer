import { type DrawerProps } from "@mui/material";
import { Drawer } from "./styles";

export default (props: DrawerProps) => {
    return(
        <Drawer {...props}>
            {props.children}
        </Drawer>
    );
}