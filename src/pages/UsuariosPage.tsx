import { useUsuarios } from '../hooks/useUsuarios';
import { Typography, Box } from '@mui/material';

function UsuariosPage() {
  const { data, loading, error } = useUsuarios();

  return (
    <Box>
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
            <Typography>
              Ciudad: {usuario.direccion?.ciudad ?? 'No especificada'}
            </Typography>
          </Box>
        ))}
    </Box>
  );
}

export default UsuariosPage;
