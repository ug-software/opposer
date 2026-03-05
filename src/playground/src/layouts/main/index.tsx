import { Outlet, useLocation, useNavigate } from "react-router"
import { useState } from "react";
import { MainWrapperLayout, MainContainerLayout, MainNavLayout } from "./styles";
import { Drawer } from "../../components";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";

import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from "../../context/auth";

const MenuItems = [
    {
        label: "Handlers",
        Icon: <BubbleChartRoundedIcon/>,
        path: "/"
    },
    {
        label: "Schemas",
        Icon: <AutoStoriesRoundedIcon/>,
        path: "/database-schema"
    },
    {
        label: "Scheduler",
        Icon: <ScheduleRoundedIcon/>,
        path: "/scheduler"
    }
]

export default () => {
    const [open, setOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleChangeOpen = () => setOpen(state => !state)

    const handleNavigate = (path: string) => {
        navigate(path);
    }

    return(
        <MainWrapperLayout>
            <MainNavLayout>
                <Drawer variant="permanent" open={open}>
                    <List>
                        {MenuItems.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton 
                                selected={location.pathname === item.path || (item.path === "/" && location.pathname === "")}
                                onClick={() => handleNavigate(item.path)}
                            >
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
                            <ListItemButton onClick={logout}>
                                <ListItemIcon>
                                    <LogoutRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sair" />
                            </ListItemButton>
                        </ListItem>
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