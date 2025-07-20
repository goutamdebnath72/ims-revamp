"use client";

import * as React from "react";
import Link from "next/link";
import { SettingsContext } from "@/context/SettingsContext";
import { getCurrentShift } from "@/lib/date-helpers";
import InfoTooltip from "./InfoTooltip";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Stack,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSession, signOut } from "next-auth/react";

const spellCheckTooltipText = (
  <Stack spacing={1.5}>
    <Box>
      <Typography color="inherit" sx={{ fontWeight: "bold", fontSize: "13px" }}>
        Enable Browser Spell Check
      </Typography>
      <Typography variant="body2">
        For this feature to work, ensure spell check is also enabled in your
        browser settings.
      </Typography>
    </Box>
    <Divider />
    <Box>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        Chrome:
      </Typography>
      <Typography variant="caption" display="block" sx={{ lineHeight: 1.2 }}>
        Settings → Languages → Spell check
      </Typography>
    </Box>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        Firefox:
      </Typography>
      <Typography variant="caption" display="block" sx={{ lineHeight: 1.2 }}>
        Settings → General → Language → Check your spelling as you type
      </Typography>
    </Box>
  </Stack>
);

const drawerWidth = 240;

// --- FIX: ADDED 'network_vendor' TO THE ROLES THAT CAN SEE THESE MENU ITEMS ---
const allMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    href: "/",
    roles: ["admin", "standard", "sys_admin", "network_vendor"],
  },
  {
    text: "Search & Archive",
    icon: <SearchIcon />,
    href: "/search?reset=true",
    roles: ["admin", "standard", "sys_admin", "network_vendor"],
  },
  {
    text: "Raise Incident",
    icon: <PostAddIcon />,
    href: "/raise",
    roles: ["admin", "standard", "sys_admin"], // Vendor cannot raise incidents
  },
  {
    text: "Pending Incidents (SYS)",
    icon: <AdminPanelSettingsIcon />,
    href: "/search?category=system&status=open",
    roles: ["sys_admin"],
    divider: true,
  },
  {
    text: "All Incidents (SYS)",
    icon: <AdminPanelSettingsIcon />,
    href: "/search?category=system",
    roles: ["sys_admin"],
  },
];

export default function AppLayout({ children }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const logout = () => signOut({ callbackUrl: "/login" });
  const { isSpellcheckEnabled, toggleSpellcheck } =
    React.useContext(SettingsContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const visibleMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isCnIT = user?.role === "admin";
  const [currentShift, setCurrentShift] = React.useState(getCurrentShift());

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      const newShift = getCurrentShift();
      if (newShift !== currentShift) {
        setCurrentShift(newShift);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentShift]);

  React.useEffect(() => {
    const logoutTimer = setInterval(() => {
      if (user?.role === "admin" && user?.loginShift) {
        const latestShift = getCurrentShift();
        if (latestShift !== user.loginShift) {
          logout();
        }
      }
    }, 60000);

    return () => clearInterval(logoutTimer);
  }, [user, logout]);

  if (status === "loading") {
    return null;
  }

  if (!user) {
    return (
      <Typography variant="h6" sx={{ m: 4 }}>
        Unauthorized
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Box>
            <Typography variant="h6" noWrap component="div">
              Incident Management System - DSP
            </Typography>
            {isCnIT && (
              <Chip
                label={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "baseline" }}
                  >
                    Current Shift:&nbsp;
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      {currentShift}
                    </Typography>
                  </Box>
                }
                color="secondary"
                size="small"
                sx={{
                  mt: 0.5,
                  color: "white",
                  fontWeight: 500,
                  height: "24px",
                }}
              />
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
              Welcome {user.name?.toUpperCase()}
            </Typography>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user.name ? user.name.charAt(0) : '?'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
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
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {visibleMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.divider && <Divider sx={{ my: 1 }} />}
              <ListItem disablePadding>
                <ListItemButton LinkComponent={Link} href={item.href}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
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