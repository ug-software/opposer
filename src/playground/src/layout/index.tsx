import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Outlet } from "react-router-dom";

import BubbleChartRoundedIcon from '@mui/icons-material/BubbleChartRounded';
import AdsClickRoundedIcon from '@mui/icons-material/AdsClickRounded';
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded';
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded';
import Drawer from "@/components/drawer";
import { useState } from "react";

export default () => {    
    const [open, setOpen] = useState<boolean>(false);
    
    const handleChange = () => setOpen(state => !state)
    const menuItems = [
        {
            title: "Query",
            Icon: <AdsClickRoundedIcon/>
        },
        {
            title: "Schema",
            Icon: <BubbleChartRoundedIcon/>
        }
    ]
    return(
        <div>
            <Drawer open={open}>
                {open ? (
                    <img src="public/opposer-light.png" height="60px" style={{ minHeight: "60px", objectFit: "contain", padding: "10px 10px", margin: "10px 8px" }}/>
                ) : (
                    <img src="public/opposer-logo-light.png" width="60px" style={{ padding: "10px", margin: "10px 0" }}/>
                )}
                <Divider />
                <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {item.Icon}
                            </ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItemButton>
                    </ListItem>
                ))}
                </List>
                <Divider />
                <List style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleChange}>
                            <ListItemIcon>
                                {open ? (
                                    <KeyboardDoubleArrowLeftRoundedIcon/>
                                ): (
                                    <KeyboardDoubleArrowRightRoundedIcon/>
                                )}
                            </ListItemIcon>
                            <ListItemText primary="Fechar" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box marginLeft={open ? "250px" : "80px"}>
                <Outlet/>
            </Box>
        </div>
    );
}