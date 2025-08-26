"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SettingsContext } from "@/context/SettingsContext";
import { useLoading } from "@/context/LoadingContext"; // Import the new hook
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
  CircularProgress, // Import CircularProgress
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import PostAddIcon from "@mui/icons-material/PostAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useSession, signOut } from "next-auth/react";
import { SearchContext } from "@/context/SearchContext";

// ... (spellCheckTooltipText and allMenuItems constants remain the same)
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
const allMenuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    href: "/",
    roles: [
      "admin",
      "standard",
      "sys_admin",
      "network_vendor",
      "biometric_vendor",
      "telecom",
      "etl",
    ],
  },
  {
    text: "Search & Archive",
    icon: <SearchIcon />,
    href: "/search",
    roles: [
      "admin",
      "standard",
      "sys_admin",
      "network_vendor",
      "biometric_vendor",
      "telecom",
      "etl",
    ],
  },
  {
    text: "Raise Incident",
    icon: <PostAddIcon />,
    href: "/raise",
    roles: ["admin", "standard", "sys_admin"],
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
  const router = useRouter();
  const { resetSearch } = React.useContext(SearchContext);
  const pathname = usePathname();
  const user = session?.user;

  // Consume the new loading context
  const { isNavigating, setIsNavigating } = useLoading();

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

  // New unified click handler for all sidebar links
  const handleLinkClick = (href) => {
    if (pathname !== href) {
      setIsNavigating(true);
    }
    if (href === "/search" && pathname === "/search") {
      resetSearch();
    } else {
      router.push(href);
    }
  };

  const visibleMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

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
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Box>
            <Typography variant="h6" noWrap component="div">
              Incident Management System - DSP
            </Typography>
            {user?.role === "admin" && (
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
            <Typography sx={{ mr: 1.5, display: { xs: "none", sm: "block" } }}>
              Welcome {user.name?.toUpperCase()}
            </Typography>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              {["admin", "sys_admin", "standard"].includes(user?.role) ? (
                <Avatar
                  alt={user.name}
                  src="/purple_more_thicker.png"
                  sx={{
                    width: "45px",
                    height: "45px",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                  }}
                >
                  {user.name ? user.name.charAt(0) : "?"}
                </Avatar>
              )}
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
                <ListItemButton
                  onClick={() => handleLinkClick(item.href)}
                  disabled={isNavigating}
                >
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
          overflow: "auto",
          position: "relative", // Add for positioning context
        }}
      >
        <Toolbar />
        {children}

        {/* --- ADD THIS LOADING OVERLAY BLOCK --- */}
        {isNavigating && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}
