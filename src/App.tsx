import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import UsuariosPage from './pages/UsuariosPage';
<<<<<<< HEAD
import SucursalesPage from './pages/SucursalesPage';
import ResenasPage from './pages/ResenasPage';
import AnaliticasPage from './pages/AnaliticasPage';
import OrdenesPage from './pages/OrdenesPage';

=======
import MenuPage from './pages/MenuPage'; // Importa tu página de Menú
>>>>>>> menu

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
<<<<<<< HEAD

              <Route path="/sucursales" element={<SucursalesPage />} />


              <Route path="/resenas" element={<ResenasPage />} />

              <Route path="/analiticas" element={<AnaliticasPage />} />
=======
              <Route path="/menu" element={<MenuPage />} /> {/* Agregamos la ruta del Menú */}
>>>>>>> menu
              {/* Puedes añadir más rutas aquí */}
              <Route path="/ordenes" element={<OrdenesPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
