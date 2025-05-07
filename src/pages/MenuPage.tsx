import { useState } from 'react';
import {
  Box,
  Typography,
  Pagination,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Fade,
  Paper,
  InputAdornment,
} from '@mui/material';
import { useMenus } from '../hooks/useMenus'; // Hook para manejar los menús
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { Menu } from '../types'; // Tipo para el menú

const MENUS_PER_PAGE = 10;

export default function MenuPage() {
  const { data: menus, loading, error, refetch } = useMenus(); // Hook para obtener los menús
  const [page, setPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [editData, setEditData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    disponible: true,
    ingredientes: '',
    esVegano: false, // Campo para saber si el menú es vegano
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * MENUS_PER_PAGE;
  const paginatedMenus = menus.slice(startIndex, startIndex + MENUS_PER_PAGE);

  const handleDelete = async () => {
    if (!deleteMenuId) return;
    try {
      await axios.delete(`http://localhost:3000/DB/menu/${deleteMenuId}`);
      setDeleteMenuId(null);
      refetch();
    } catch (error) {
      console.error("Error al eliminar el menú:", error);
    }
  };

  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setEditData({
      codigo: menu.codigo,
      nombre: menu.nombre,
      descripcion: menu.descripcion,
      categoria: menu.categoria,
      precio: menu.precio.toString(), // Convertimos el precio a string
      disponible: menu.disponible,
      ingredientes: menu.ingredientes.join(', '),
      esVegano: menu.esVegano || false, // Convertir vegano según el estado del menú
    });
    setIsEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!selectedMenu) return;

    // Verificar si el precio es un número válido
    const precio = parseFloat(editData.precio);
    if (isNaN(precio)) {
      alert("Por favor ingrese un precio válido");
      return;
    }

    const updated = {
      codigo: editData.codigo,
      nombre: editData.nombre,
      descripcion: editData.descripcion,
      categoria: editData.categoria,
      precio: precio, // Guardamos el precio como número
      disponible: editData.disponible,
      ingredientes: editData.ingredientes.split(', '),
      esVegano: editData.esVegano,
    };

    try {
      await axios.put(`http://localhost:3000/DB/menu/${selectedMenu._id}`, updated);
      setIsEditOpen(false);
      refetch();
    } catch (error) {
      console.error("Error al actualizar el menú:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Lista de Menús</Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        Página {page}
      </Typography>

      {!loading && menus.length > MENUS_PER_PAGE && (
        <Pagination
          count={Math.ceil(menus.length / MENUS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          color="primary"
          sx={{ mb: 3 }}
        />
      )}

      {loading && <Typography>Cargando...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {paginatedMenus.map((menu, index) => (
        <Fade in={true} timeout={600 + index * 100} key={menu._id}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 24 }}>
                  {menu.nombre.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold" fontSize={18}>{menu.nombre}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{menu.codigo}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{menu.categoria}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{menu.precio} $</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{menu.ingredientes.join(', ')}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleEditClick(menu)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => setDeleteMenuId(menu._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      ))}

      <Dialog open={!!deleteMenuId} onClose={() => setDeleteMenuId(null)}>
        <DialogTitle>¿Eliminar menú?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteMenuId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Menú</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField label="Código" fullWidth value={editData.codigo} onChange={(e) => setEditData({ ...editData, codigo: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" fullWidth value={editData.nombre} onChange={(e) => setEditData({ ...editData, nombre: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Descripción" fullWidth value={editData.descripcion} onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Categoría" fullWidth value={editData.categoria} onChange={(e) => setEditData({ ...editData, categoria: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Precio" fullWidth type="number" value={editData.precio} onChange={(e) => setEditData({ ...editData, precio: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ingredientes" fullWidth value={editData.ingredientes} onChange={(e) => setEditData({ ...editData, ingredientes: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="¿Es vegano?"
                fullWidth
                type="checkbox"
                checked={editData.esVegano}
                onChange={(e) => setEditData({ ...editData, esVegano: e.target.checked })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
