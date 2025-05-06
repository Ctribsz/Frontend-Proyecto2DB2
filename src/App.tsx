import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useFetch } from './useFetch';
import { Usuario } from './types';
import Header from './components/Header';

function App() {
  const { data, loading, error } = useFetch<Usuario[]>('http://localhost:3000/DB/usuarios');

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Lista de Usuarios
          </Typography>

          {loading && <Typography>Cargando...</Typography>}
          {error && <Typography color="error">Error: {error}</Typography>}

          {data &&
            data.map((usuario) => (
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
                <Typography>Ciudad: {usuario.direccion?.ciudad ?? 'No especificada'}</Typography>
              </Box>
            ))}
        </Box>
      </Container>
    </>
  );
}

export default App;
