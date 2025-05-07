// src/pages/MenuPage.tsx
import { useState } from 'react';
import {
  Box, Typography, Pagination, Avatar, IconButton, Dialog,
  DialogActions, DialogContent, DialogTitle, Button, TextField,
  Grid, Fade, Paper, InputAdornment, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { useMenus } from '../hooks/useMenus';
import { Menu } from '../types';

const MENUS_PER_PAGE = 10;

export default function MenuPage() {
  const { data: menus, loading, error, refetch } = useMenus();
  const [page, setPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [editData, setEditData] = useState({
    _id: '', 
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    disponible: true,
    ingredientes: '',
    esVegano: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [sortedMenus, setSortedMenus] = useState<Menu[] | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
  const [bulkList, setBulkList] = useState<any[]>([]);
  const [idsToDelete, setIdsToDelete] = useState('');

  const handleChange = (_: any, value: number) => setPage(value);

  const startIndex = (page - 1) * MENUS_PER_PAGE;

  const showMessage = (msg: string) => setSnackbar({ open: true, message: msg });

  const handleEditClick = (menu: Menu) => {
    setSelectedMenu(menu);
    setEditData({
      _id: menu._id, // ← ✅ Agrega esto
      codigo: menu.codigo,
      nombre: menu.nombre,
      descripcion: menu.descripcion,
      categoria: menu.categoria,
      precio: menu.precio.toString(),
      disponible: menu.disponible,
      ingredientes: menu.ingredientes.join(', '),
      esVegano: menu.esVegano || false,
    });
    setIsEditOpen(true);
  };
  

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:3000/DB/menu/${editData._id}`, {
        ...editData,
        precio: parseFloat(editData.precio),
        ingredientes: editData.ingredientes.split(',').map(i => i.trim())
      });
      showMessage('Menú actualizado');

      refetch();
      setPage(1); 
    } catch {
      showMessage('Error al actualizar menú');
    }
    setIsEditOpen(false);
  };
  const currentMenus = sortedMenus || menus;
  const paginatedMenus = currentMenus.slice(startIndex, startIndex + MENUS_PER_PAGE);
  
  const handleDelete = async () => {
    if (!deleteMenuId) return;
    try {
      await axios.delete(`http://localhost:3000/DB/menu/${deleteMenuId}`);
      showMessage('Menú eliminado');
      refetch();
      setPage(1); // Para que el nuevo orden se vea
    } catch {
      showMessage('Error al eliminar menú');
    }
    setDeleteMenuId(null); // Cierra el diálogo
  };
  
  const handleCreate = async () => {
    try {
      const { _id, ...dataWithoutId } = editData; 
      await axios.post('http://localhost:3000/DB/menu', {
        ...dataWithoutId,
        precio: parseFloat(editData.precio),
        ingredientes: editData.ingredientes.split(',').map(i => i.trim())
      });
      showMessage('Menú creado');
      refetch();
      setPage(1); 
    } catch {
      showMessage('Error al crear menú');
    }
    setIsCreateOpen(false);
    setEditData({ codigo: '', nombre: '', descripcion: '', categoria: '', precio: '', disponible: true, ingredientes: '', esVegano: false });
  };
  

  const handleSort = async (order: 'asc' | 'desc') => {
    try {
      const url = `http://localhost:3000/DB/utils/${order === 'asc' ? 'sortAsc' : 'sortDesc'}/menu`;
      const response = await axios.get(url);
      setSortedMenus(response.data);
    } catch (error) {
      console.error('Error al ordenar:', error);
    }
  };
  
  const handleSortBy = async (campo: string, orden: 'asc' | 'desc') => {
    try {
      const response = await axios.get(`http://localhost:3000/DB/menu`, {
        params: {
          orden: JSON.stringify({ [campo]: orden === 'asc' ? 1 : -1 })
        }
      });
      setSortedMenus(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  
  
  

  const handleAddToBulk = () => {
    const item = {
      codigo: editData.codigo,
      nombre: editData.nombre,
      descripcion: editData.descripcion,
      categoria: editData.categoria,
      precio: parseFloat(editData.precio),
      disponible: editData.disponible,
      ingredientes: editData.ingredientes.split(',').map(i => i.trim()),
      esVegano: editData.esVegano
    };
    if (editData._id) item['_id'] = editData._id;
    setBulkList([...bulkList, item]);
    setEditData({  codigo: '', nombre: '', descripcion: '', categoria: '', precio: '', disponible: true, ingredientes: '', esVegano: false });
  };

  const handleBulkRegister = async () => {
    try {
      await axios.post('http://localhost:3000/DB/menu/bulk-create', bulkList);
      showMessage('Platillos registrados');
      refetch();
      setPage(1); 
    } catch {
      showMessage('Error al registrar múltiples');
    }
    setIsBulkOpen(false);
    setBulkList([]);
  };

  const handleBulkDelete = async () => {
    try {
      const body = idsToDelete.split(',').map(id => ({ _id: id.trim() }));
      await axios.delete('http://localhost:3000/DB/menu/bulk-delete', { data: body });
      showMessage('Platillos eliminados');
      refetch();
      setPage(1); 
    } catch {
      showMessage('Error al eliminar múltiples');
    }
    setIsBulkDeleteOpen(false);
    setIdsToDelete('');
  };

  const handleBulkUpdate = async () => {
    try {
      const body = bulkList.map(({ _id, ...rest }) => ({
        filter: { _id },
        data: { ...rest }
      }));
      await axios.put('http://localhost:3000/DB/menu/bulk-update', body);
      showMessage('Platillos actualizados');
      refetch();
      setPage(1); 
    } catch {
      showMessage('Error al actualizar múltiples');
    }
    setIsBulkUpdateOpen(false);
    setBulkList([]);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Menús</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)} startIcon={<AddIcon />}>Agregar</Button>
        <Button variant="outlined" onClick={() => setIsBulkOpen(true)}>Agregar varios</Button>
        <Button variant="outlined" onClick={() => setIsBulkUpdateOpen(true)}>Actualizar varios</Button>
        <Button variant="outlined" color="error" onClick={() => setIsBulkDeleteOpen(true)}>Eliminar varios</Button>
        <Button onClick={() => handleSort('asc')}>Ordenar por Precio Ascendente</Button>
<Button onClick={() => handleSort('desc')}>Ordenar por Precio Descendente</Button>
<Button onClick={() => handleSortBy('precio', 'asc')}>Precio ↑</Button>
<Button onClick={() => handleSortBy('precio', 'desc')}>Precio ↓</Button>

      </Box>

      {paginatedMenus.map((menu, i) => (
        <Fade in key={menu._id} timeout={400 + i * 100}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{menu.nombre}</Typography>
                <Typography>Precio: ${menu.precio}</Typography>
                <Typography>Ingredientes: {menu.ingredientes.join(', ')}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleEditClick(menu)}><EditIcon /></IconButton>
                <IconButton onClick={() => setDeleteMenuId(menu._id)}><DeleteIcon /></IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      ))}
<Pagination count={Math.ceil(currentMenus.length / MENUS_PER_PAGE)} page={page} onChange={handleChange} />


      {/* Dialogs */}
      <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <DialogTitle>Agregar Platillo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'ingredientes'].map(field => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field}
                  fullWidth
                  value={editData[field as keyof typeof editData]}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
          <Button onClick={handleCreate}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <DialogTitle>Editar Platillo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'ingredientes'].map(field => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field}
                  fullWidth
                  value={editData[field as keyof typeof editData]}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isBulkOpen} onClose={() => setIsBulkOpen(false)}>
        <DialogTitle>Agregar múltiples platillos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {['codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'ingredientes'].map(field => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field}
                  fullWidth
                  value={editData[field as keyof typeof editData]}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToBulk}>Agregar a lista</Button>
          <Button onClick={handleBulkRegister}>Registrar todos</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteMenuId} onClose={() => setDeleteMenuId(null)}>
  <DialogTitle>¿Eliminar menú?</DialogTitle>
  <DialogContent>
    <Typography>¿Estás seguro de que deseas eliminar este menú?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteMenuId(null)}>Cancelar</Button>
    <Button onClick={handleDelete} color="error">Eliminar</Button>
  </DialogActions>
</Dialog>


      <Dialog open={isBulkDeleteOpen} onClose={() => setIsBulkDeleteOpen(false)}>
        <DialogTitle>Eliminar múltiples platillos</DialogTitle>
        <DialogContent>
          <TextField
            label="IDs separados por coma"
            fullWidth
            value={idsToDelete}
            onChange={(e) => setIdsToDelete(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDelete} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isBulkUpdateOpen} onClose={() => setIsBulkUpdateOpen(false)}>
        <DialogTitle>Actualizar múltiples platillos</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {['_id', 'codigo', 'nombre', 'descripcion', 'categoria', 'precio', 'ingredientes'].map(field => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field}
                  fullWidth
                  value={editData[field as keyof typeof editData]}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToBulk}>Agregar a lista</Button>
          <Button onClick={handleBulkUpdate}>Actualizar todos</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} message={snackbar.message} autoHideDuration={3000} onClose={() => setSnackbar({ open: false, message: '' })} />
    </Box>
  );
}
