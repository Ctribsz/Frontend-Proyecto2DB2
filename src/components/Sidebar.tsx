import * as React from "react";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useNavigate, useLocation } from "react-router-dom";
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';


import quetzalLogo from "../assets/quetzal-logo.png";

const drawerWidth = 260;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#1e293b",
  color: "white",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#1e293b",
  color: "white",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const menuItems = [
  { text: "Usuarios", icon: <PeopleIcon />, path: "/usuarios" },
  { text: "Órdenes", icon: <ShoppingCartIcon />, path: "/ordenes" },
  { text: "Reseñas", icon: <StarIcon />, path: "/resenas" },
  { text: "Menú", icon: <RestaurantMenuIcon />, path: "/menu" }, // Aquí se agrega la ruta para el menú
  { text: "Sucursales", icon: <StorefrontIcon />, path: "/sucursales" },

  { text: "Graficas", icon: <InsertChartOutlinedIcon />, path: "/analiticas" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer variant="permanent" open={true}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
          <img
            src={quetzalLogo}
            alt="Quetzal Restaurant Logo"
            style={{ height: "60px", marginRight: "10px" }}
          />
        </Box>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
          Quetzal Restaurant
        </Typography>
      </Box>

      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

      <List>
        {menuItems.map((item, index) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  backgroundColor: isSelected ? "#60a5fa" : "transparent",
                  "&:hover": { backgroundColor: "#fb923c" },
                  my: 0.5,
                  mx: 1,
                  borderRadius: "8px",
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                    color: isSelected ? "white" : "#93c5fd",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: isSelected ? "bold" : "normal",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
