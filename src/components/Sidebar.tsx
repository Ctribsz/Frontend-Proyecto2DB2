import * as React from "react"
import { styled, type Theme, type CSSObject } from "@mui/material/styles"
import Box from "@mui/material/Box"
import MuiDrawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import StarIcon from "@mui/icons-material/Star"
import StorefrontIcon from "@mui/icons-material/Storefront"

import quetzalLogo from "../assets/quetzal-logo.png" 

const drawerWidth = 260

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#1e293b", 
  color: "white",
})

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
})

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
}))


const menuItems = [
  { text: "Usuarios", icon:<PeopleIcon /> ,  path: "/" },
  { text: "Ordenes", icon: <DashboardIcon />, path: "/users" },
  { text: "Reseñas", icon: <StarIcon /> , path: "/restaurants" },
  { text: "Menu", icon: <RestaurantMenuIcon />, path: "/menu-items" },
  { text: "Sucursales", icon: <StorefrontIcon />, path: "/reviews" },
]

export default function Sidebar() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const handleNavigation = (path: string, index: number) => {
    setSelectedIndex(index)
   
  }

  return (
    <Drawer variant="permanent" open={true}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        {/* Logo y título del restaurante */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
          <img
            src={quetzalLogo || "/placeholder.svg"}
            alt="Quetzal Restaurant Logo"
            style={{
              height: "60px",
              marginRight: "10px",
            }}
          />
        </Box>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "bold" }}>
          Quetzal Restaurant
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
      <List>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
                backgroundColor: selectedIndex === index ? "#60a5fa" : "transparent", // Light blue when selected
                "&:hover": {
                  backgroundColor: "#fb923c", // Orange on hover
                },
                my: 0.5,
                mx: 1,
                borderRadius: "8px",
              }}
              onClick={() => handleNavigation(item.path, index)}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 3,
                  justifyContent: "center",
                  color: selectedIndex === index ? "white" : "#93c5fd", // Light blue icon
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: selectedIndex === index ? "bold" : "normal",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}


