import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import UsuariosPage from './pages/UsuariosPage';
import OrdenesPage from './pages/OrdenesPage';


const theme = createTheme({
  palette: {
    primary: { main: '#60a5fa' }, // Azul claro
    secondary: { main: '#fb923c' }, // Naranja
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/ordenes" element={<OrdenesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
