import { Outlet, useParams, useLocation } from "react-router"
import { useState } from "react";
import { MainWrapperLayout, MainContainerLayout, MainNavLayout } from "./styles";
import { Drawer } from "../../components";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";

import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';

const MenuItems = [
    {
        label: "Handlers",
        Icon: <BubbleChartRoundedIcon/>
    },
    {
        label: "Schemas",
        Icon: <AutoStoriesRoundedIcon/>
    }
]

export default () => {
    const [open, setOpen] = useState<boolean>(false);
    const location = useLocation();

    const handleChangeOpen = () => setOpen(state => !state)

    return(
        <MainWrapperLayout>
            <MainNavLayout>
                <Drawer variant="permanent" open={open}>
                    <List>
                        {MenuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton selected={location.pathname.includes(item.label.toLowerCase())}>
                                <ListItemIcon>
                                    {item.Icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleChangeOpen}>
                                <ListItemIcon>
                                    {!open ? <KeyboardDoubleArrowRightRoundedIcon /> : <KeyboardDoubleArrowLeftRoundedIcon/>}
                                </ListItemIcon>
                                <ListItemText primary="Fechar" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Drawer>
            </MainNavLayout>
            <MainContainerLayout open={open}>
                <Outlet/>
            </MainContainerLayout>
        </MainWrapperLayout>
    );
}