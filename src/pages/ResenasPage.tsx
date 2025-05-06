// src/pages/ResenasPage.tsx
import { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Fade, Avatar, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Grid, Snackbar, InputAdornment, Pagination
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import { useUsuarios } from '../hooks/useUsuarios'
import { useSucursales } from '../hooks/useSucursales'
import { useResenas } from '../hooks/useResenas'

export default function ResenasPage() {
  const { data: resenas, refetch } = useResenas()
  const { data: usuarios } = useUsuarios()
  const { data: sucursales } = useSucursales()
  const [openRegisterSingle, setOpenRegisterSingle] = useState(false)

  const [page, setPage] = useState(1)
  const [searchId, setSearchId] = useState('')
  const [editData, setEditData] = useState({
    _id: '',
    usuarioId: '',
    sucursalId: '',
    ordenId: '',
    calificacion: '',
    comentario: ''
  })
  
  const [selected, setSelected] = useState<any | null>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openRegisterMany, setOpenRegisterMany] = useState(false)
  const [openDeleteMany, setOpenDeleteMany] = useState(false)
  const [openUpdateMany, setOpenUpdateMany] = useState(false)
  const [bulkList, setBulkList] = useState<any[]>([])
  const [idToDelete, setIdToDelete] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const ITEMS_PER_PAGE = 30
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const filtered = resenas.filter((r) => r._id.includes(searchId))
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const showMessage = (message: string) => setSnackbar({ open: true, message })

  const findNombre = (id: string, tipo: 'usuario' | 'sucursal') =>
    tipo === 'usuario'
      ? usuarios.find((u) => u._id === id)?.nombre || 'Usuario desconocido'
      : sucursales.find((s) => s._id === id)?.nombre || 'Sucursal desconocida'

  const handleEdit = (r: any) => {
    setSelected(r)
    setEditData({
      _id: r._id,
      usuarioId: r.usuarioId,
      sucursalId: r.sucursalId,
      ordenId: r.ordenId,
      calificacion: r.calificacion.toString(),
      comentario: r.comentario
    })
    setOpenEdit(true)
  }

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:3000/DB/resenas/${editData._id}`, {
        usuarioId: editData.usuarioId,
        sucursalId: editData.sucursalId,
        ordenId: editData.ordenId,
        calificacion: parseInt(editData.calificacion),
        comentario: editData.comentario
      })      
      showMessage('Reseña actualizada')
      refetch()
    } catch {
      showMessage('Error al actualizar reseña')
    }
    setOpenEdit(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/DB/resenas/${id}`)
      showMessage('Reseña eliminada')
      refetch()
    } catch {
      showMessage('Error al eliminar reseña')
    }
  }

  const handleAddToBulk = () => {
    setBulkList([...bulkList, {
      _id: editData._id,
      usuarioId: editData.usuarioId,
      sucursalId: editData.sucursalId,
      ordenId: editData.ordenId,
      calificacion: parseInt(editData.calificacion),
      comentario: editData.comentario
    }])
    setEditData({ _id: '', usuarioId: '', sucursalId: '', ordenId: '', calificacion: '', comentario: '' })
  }
  

  const handleRegisterSingle = async () => {
    try {
      const nueva = {
        usuarioId: editData.usuarioId,
        sucursalId: editData.sucursalId,
        ordenId: editData.ordenId,
        calificacion: parseInt(editData.calificacion),
        comentario: editData.comentario
      }
      const response = await axios.post(`http://localhost:3000/DB/resenas`, nueva)
      showMessage('Reseña registrada')
  
      // Mostrar al inicio
      setResenas([response.data, ...resenas])
      setPage(1)
    } catch {
      showMessage('Error al registrar reseña')
    }
    setOpenRegisterSingle(false)
    setEditData({ _id: '', usuarioId: '', sucursalId: '', ordenId: '', calificacion: '', comentario: '' })
  }
  
  
  
  const handleBulkRegister = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/DB/resenas/bulk-create`, bulkList)
      showMessage('Reseñas registradas')
  
      // Mostrar nuevas al inicio
      setResenas([...response.data, ...resenas])
      setPage(1)
    } catch {
      showMessage('Error al registrar reseñas')
    }
    setOpenRegisterMany(false)
    setBulkList([])
  }
  

  const handleDeleteBulk = async () => {
    try {
      const ids = idToDelete.split(',').map(id => ({ _id: id.trim() }))
      await axios.delete(`http://localhost:3000/DB/resenas/bulk-delete`, { data: ids })
      showMessage('Reseñas eliminadas')
      refetch()
    } catch {
      showMessage('Error al eliminar múltiples')
    }
    setOpenDeleteMany(false)
    setIdToDelete('')
  }

  const handleBulkUpdate = async () => {
    try {
      const updates = bulkList.map(item => ({
        filter: { _id: item._id },
        data: {
          usuarioId: item.usuarioId,
          sucursalId: item.sucursalId,
          ordenId: item.ordenId,
          calificacion: parseInt(item.calificacion),
          comentario: item.comentario
        }
      }))
      await axios.put(`http://localhost:3000/DB/resenas/bulk-update`, updates)
      showMessage('Reseñas actualizadas')
      refetch()
    } catch {
      showMessage('Error al actualizar múltiples')
    }
    setOpenUpdateMany(false)
    setBulkList([])
  }
  

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Lista de Reseñas</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={() => setOpenRegisterSingle(true)}>Registrar Reseña</Button>
          <Button variant="contained" onClick={() => setOpenRegisterMany(true)}>Registrar Varias</Button>
          <Button variant="outlined" color="error" onClick={() => setOpenDeleteMany(true)}>Eliminar Varias</Button>
          <Button variant="outlined" onClick={() => setOpenUpdateMany(true)}>Actualizar Varias</Button>
        </Box>
      </Box>

      <TextField
        label="Buscar por ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        sx={{ mb: 3 }}
      />

      {paginated.map((r, i) => (
        <Fade in={true} timeout={400 + i * 100} key={r._id}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar><RateReviewIcon /></Avatar>
                <Box>
                <Typography><b>ID:</b> {r._id}</Typography>
                  <Typography><b>Calificación:</b> {r.calificacion} ⭐</Typography>
                  <Typography><b>Comentario:</b> {r.comentario}</Typography>
                  <Typography><b>Usuario:</b> {r.usuarioId}</Typography>
                  <Typography><b>Orden:</b> {r.ordenId}</Typography>
                  <Typography><b>Sucursal:</b> {r.sucursalId}</Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleEdit(r)}><EditIcon color="primary" /></IconButton>
                <IconButton onClick={() => handleDelete(r._id)}><DeleteIcon color="error" /></IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      ))}

      <Pagination count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} page={page} onChange={(_, v) => setPage(v)} sx={{ mt: 3 }} />

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Reseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
          {['usuarioId', 'sucursalId', 'ordenId', 'calificacion', 'comentario'].map((field) => (
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
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRegisterMany} onClose={() => setOpenRegisterMany(false)}>
        <DialogTitle>Registrar Varias Reseñas</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
          {['usuarioId', 'sucursalId', 'ordenId', 'calificacion', 'comentario'].map((field) => (
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
          <Button onClick={handleBulkRegister}>Registrar todas</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteMany} onClose={() => setOpenDeleteMany(false)}>
        <DialogTitle>Eliminar Varias</DialogTitle>
        <DialogContent>
          <TextField
            label="IDs separados por coma"
            fullWidth
            value={idToDelete}
            onChange={(e) => setIdToDelete(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteBulk} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateMany} onClose={() => setOpenUpdateMany(false)}>
        <DialogTitle>Actualizar Varias</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['usuarioId', 'sucursalId', 'calificacion', 'comentario', '_id'].map((field) => (
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
          <Button onClick={handleBulkUpdate}>Actualizar todas</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openRegisterSingle} onClose={() => setOpenRegisterSingle(false)}>
  <DialogTitle>Registrar Reseña</DialogTitle>
  <DialogContent>
    <Grid container spacing={2} mt={1}>
    {['usuarioId', 'sucursalId', 'ordenId', 'calificacion', 'comentario'].map((field) => (
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
    <Button onClick={() => setOpenRegisterSingle(false)}>Cancelar</Button>
    <Button onClick={handleRegisterSingle}>Registrar</Button>
  </DialogActions>
</Dialog>


      <Snackbar open={snackbar.open} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} autoHideDuration={3000} />
    </Box>
  )
}
