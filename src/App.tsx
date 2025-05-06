import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Sidebar from './components/Sidebar';
import { useUsuarios } from './hooks/useUsuarios'; // nuevo hook
import { Usuario } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#60a5fa', // Azul claro
    },
    secondary: {
      main: '#fb923c', // Naranja
    },
  },
});

function App() {
  const { data, loading, error } = useUsuarios();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Container>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" gutterBottom>
                Lista de Usuarios
              </Typography>

              {loading && <Typography>Cargando...</Typography>}
              {error && <Typography color="error">Error: {error}</Typography>}

              {data &&
                data.map((usuario: Usuario) => (
                  <Box
                    key={usuario._id}
                    sx={{
                      mb: 2,
                      p: 2,
                      border: '1px solid #ccc',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="h6">{usuario.nombre}</Typography>
                    <Typography>Correo: {usuario.correo}</Typography>
                    <Typography>Teléfono: {usuario.telefono}</Typography>
                    <Typography>Rol: {usuario.rol}</Typography>
                    <Typography>
                      Ciudad: {usuario.direccion?.ciudad ?? 'No especificada'}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
