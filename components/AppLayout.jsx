"use client";

import * as React from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import { SettingsContext } from "@/context/SettingsContext";
import InfoTooltip from './InfoTooltip';

// MUI Components
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import SpellcheckIcon from '@mui/icons-material/Spellcheck';

const spellCheckTooltipText = (
  <Stack spacing={1}>
    <Typography color="inherit" sx={{ fontWeight: 'bold', fontSize: '13px' }}>
      Enable Browser Spell Check
    </Typography>
    <Typography variant="body2">
      For this feature to work, ensure spell check is also enabled in your browser settings.
    </Typography>
    <Box>
      <Typography variant="body2" component="div">
        <b>Chrome:</b> Settings → Languages → Spell check
      </Typography>
      <Typography variant="body2" component="div" sx={{ mt: 0.5 }}>
        <b>Firefox:</b> Settings → General → Language → "Check your spelling..."
      </Typography>
    </Box>
  </Stack>
);

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, href: "/" },
  { text: "Search & Archive", icon: <SearchIcon />, href: "/search" },
  { text: "Raise Incident", icon: <PostAddIcon />, href: "/raise" },
];

export default function AppLayout({ children }) {
  const { user, logout } = React.useContext(UserContext);
  const { isSpellcheckEnabled, toggleSpellcheck } = React.useContext(SettingsContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };
  
  if (!user) {
    return null; 
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Incident Management System - DSP
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
              Welcome {user.name.toUpperCase()}
            </Typography>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user.initials}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={open}
              onClose={handleClose}
            >
              <InfoTooltip title={spellCheckTooltipText} placement="left">
                <MenuItem onClick={toggleSpellcheck}>
                  <ListItemIcon>
                    <SpellcheckIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Spell Check</ListItemText>
                  <Switch
                    checked={isSpellcheckEnabled}
                    edge="end"
                    size="small"
                    name="spellcheck-toggle"
                  />
                </MenuItem>
              </InfoTooltip>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton LinkComponent={Link} href={item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}