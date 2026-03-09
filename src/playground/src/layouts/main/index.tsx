import { Outlet, useLocation, useNavigate } from "react-router"
import { useState } from "react";
import { MainWrapperLayout, MainContainerLayout, MainNavLayout } from "./styles";
import { Drawer } from "../../components";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box } from "@mui/material";

import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import { useAuth } from "../../context/auth";

const ConsultationItems = [
    {
        label: "Controllers",
        Icon: <BubbleChartRoundedIcon/>,
        path: "/"
    },
    {
        label: "Models",
        Icon: <AutoStoriesRoundedIcon/>,
        path: "/database-model"
    },
    {
        label: "Scheduler",
        Icon: <ScheduleRoundedIcon/>,
        path: "/scheduler"
    }
]

const ManagementItems = [
    {
        label: "Users",
        Icon: <PeopleRoundedIcon/>,
        path: "/user-management"
    },
    {
        label: "API Keys",
        Icon: <VpnKeyRoundedIcon/>,
        path: "/key-management"
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
                    <Box sx={{ px: 2, py: 1, mt: 3, display: open ? 'block' : 'none' }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'capitalize' }}>
                            Database
                        </Typography>
                    </Box>

                    <List>
                        {ConsultationItems.map((item, index) => (
                        <ListItem key={index} sx={{ mb: 0.5, p: "0 8px"  }}>
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
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ px: 2, py: 1, display: open ? 'block' : 'none' }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'capitalize' }}>
                            Gerenciamento
                        </Typography>
                    </Box>

                    <List>
                        {ManagementItems.map((item, index) => (
                        <ListItem key={index} sx={{ mb: 0.5, p: "0 8px"  }}>
                            <ListItemButton 
                                selected={location.pathname === item.path}
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

                    <Divider sx={{ mt: 'auto', mb: 1 }} />
                    <List style={{ display: "flex", flexDirection: "column" }}>
                        <ListItem sx={{ mb: 0.5, p: "0 8px"  }}>
                            <ListItemButton onClick={logout}>
                                <ListItemIcon>
                                    <LogoutRoundedIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sair" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem sx={{ mb: 0.5, p: "0 8px" }}>
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