import { createTheme, ThemeProvider } from "@mui/material/styles"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Sidebar from "./components/Sidebar"

// Create a theme with light blue and orange colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#60a5fa", // Light blue
    },
    secondary: {
      main: "#fb923c", // Orange
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        
      </Box>
    </ThemeProvider>
  )
}

export default App
