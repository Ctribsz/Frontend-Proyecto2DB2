// src/pages/SucursalesPage.tsx
import { useEffect, useState, useCallback } from 'react'
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
  Snackbar,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import axios from 'axios'
import { useSucursales } from '../hooks/useSucursales'

const ITEMS_PER_PAGE = 10

export default function SucursalesPage() {
  const { data: sucursales, loading, error, refetch } = useSucursales()
  const [page, setPage] = useState(1)
  const [searchId, setSearchId] = useState('')
  const [filterZona, setFilterZona] = useState('')
  const [editData, setEditData] = useState({
    nombre: '', telefono: '', horario: '', ciudad: '', zona: '', direccion: ''
  })
  const [selected, setSelected] = useState<any | null>(null)

  const [updateList, setUpdateList] = useState<any[]>([])
  const [openEdit, setOpenEdit] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const [openRegisterMany, setOpenRegisterMany] = useState(false)
  const [openDeleteMany, setOpenDeleteMany] = useState(false)
  const [bulkList, setBulkList] = useState<any[]>([])
  const [idToDelete, setIdToDelete] = useState<string>('')

  const [openUpdateMany, setOpenUpdateMany] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' })

  const handleChange = (_: any, value: number) => setPage(value)

  const filtered = sucursales.filter((s) => {
    const matchId = searchId ? s._id.includes(searchId) : true
    const matchZona = filterZona ? s.ubicacion?.zona?.toString() === filterZona : true
    return matchId && matchZona
  })

  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const showMessage = (message: string) => setSnackbar({ open: true, message })

  const handleEdit = (s: any) => {
    setSelected(s)
    setEditData({
      nombre: s.nombre,
      telefono: s.telefono,
      horario: s.horario,
      ciudad: s.ubicacion?.ciudad || '',
      zona: s.ubicacion?.zona?.toString() || '',
      direccion: s.ubicacion?.direccion || ''
    })
    setOpenEdit(true)
  }

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:3000/DB/sucursales/${selected._id}`, {
        nombre: editData.nombre,
        telefono: editData.telefono,
        horario: editData.horario,
        ubicacion: {
          ciudad: editData.ciudad,
          zona: parseInt(editData.zona),
          direccion: editData.direccion
        }
      })
      showMessage('Sucursal actualizada con éxito')
      refetch()
    } catch {
      showMessage('Error al actualizar sucursal')
    }
    setOpenEdit(false)
  }

  const handleRegister = async () => {
    try {
      await axios.post(`http://localhost:3000/DB/sucursales`, {
        nombre: editData.nombre,
        telefono: editData.telefono,
        horario: editData.horario,
        ubicacion: {
          ciudad: editData.ciudad,
          zona: parseInt(editData.zona),
          direccion: editData.direccion
        }
      })
      showMessage('Sucursal registrada')
      refetch()
    } catch {
      showMessage('Error al registrar')
    }
    setOpenRegister(false)
    setEditData({ nombre: '', telefono: '', horario: '', ciudad: '', zona: '', direccion: '' })
  }

  const handleAddToBulk = () => {
    const nueva = {
      nombre: editData.nombre,
      telefono: editData.telefono,
      horario: editData.horario,
      ubicacion: {
        ciudad: editData.ciudad,
        zona: parseInt(editData.zona),
        direccion: editData.direccion
      }
    }
    setBulkList([...bulkList, nueva])
    setEditData({ nombre: '', telefono: '', horario: '', ciudad: '', zona: '', direccion: '' })
  }

  const handleAddToUpdate = () => {
    const data = {
      filter: { _id: editData.id },
      data: {
        nombre: editData.nombre,
        telefono: editData.telefono,
        horario: editData.horario,
        ubicacion: {
          ciudad: editData.ciudad,
          zona: parseInt(editData.zona),
          direccion: editData.direccion
        }
      }
    }
    setUpdateList([...updateList, data])
    setEditData({ nombre: '', telefono: '', horario: '', ciudad: '', zona: '', direccion: '' })
  }
  const handleBulkRegister = async () => {
    try {
      await axios.post(`http://localhost:3000/DB/sucursales/bulk-create`, bulkList)
      showMessage('Sucursales registradas')
      refetch()
    } catch {
      showMessage('Error al registrar múltiples')
    }
    setOpenRegisterMany(false)
    setBulkList([])
  }


  const handleBulkUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/DB/sucursales/bulk-update`, updateList)
      showMessage('Sucursales actualizadas')
      refetch()
    } catch {
      showMessage('Error al actualizar múltiples')
    }
    setOpenUpdateMany(false)
    setUpdateList([])
  }

  const handleDeleteBulk = async () => {
    try {
      const ids = idToDelete.split(',').map(id => ({ _id: id.trim() }))
      await axios.delete(`http://localhost:3000/DB/sucursales/bulk-delete`, { data: ids })
      showMessage('Sucursales eliminadas')
      refetch()
    } catch {
      showMessage('Error al eliminar múltiples')
    }
    setOpenDeleteMany(false)
    setIdToDelete('')
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Lista de Sucursales</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenRegister(true)}>Registrar</Button>
          <Button variant="outlined" color="warning" onClick={() => setOpenUpdateMany(true)}>Actualizar varias</Button>
          <Button variant="outlined" onClick={() => setOpenRegisterMany(true)}>Registrar varias</Button>
          <Button variant="outlined" color="error" onClick={() => setOpenDeleteMany(true)}>Eliminar varias</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField
          label="Filtrar por zona"
          value={filterZona}
          onChange={(e) => setFilterZona(e.target.value)}
        />
      </Box>

      {paginated.map((sucursal, i) => (
        <Fade in={true} timeout={500 + i * 100} key={sucursal._id}>
          <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar><RestaurantIcon /></Avatar>
                <Box>
                  <Typography fontWeight={600}>{sucursal.nombre}</Typography>
                  <Typography>📍 {sucursal.ubicacion?.direccion}</Typography>
                  <Typography>Zona: {sucursal.ubicacion?.zona} | Ciudad: {sucursal.ubicacion?.ciudad}</Typography>
                  <Typography>Tel: {sucursal.telefono} | Horario: {sucursal.horario}</Typography>
                  <Typography>ID: {sucursal._id} </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleEdit(sucursal)}><EditIcon color="primary" /></IconButton>
                <IconButton onClick={() => axios.delete(`http://localhost:3000/DB/sucursales/${sucursal._id}`).then(() => { showMessage('Eliminado'); refetch() }).catch(() => showMessage('Error al eliminar'))}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      ))}

      <Pagination count={Math.ceil(filtered.length / ITEMS_PER_PAGE)} page={page} onChange={handleChange} sx={{ mt: 3 }} />

      {/* Dialogs reutilizables */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar sucursal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['nombre', 'telefono', 'horario', 'ciudad', 'zona', 'direccion'].map((field) => (
              <Grid item xs={field === 'direccion' ? 12 : 6} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
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

      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <DialogTitle>Registrar Sucursal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['nombre', 'telefono', 'horario', 'ciudad', 'zona', 'direccion'].map((field) => (
              <Grid item xs={field === 'direccion' ? 12 : 6} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  fullWidth
                  value={editData[field as keyof typeof editData]}
                  onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegister(false)}>Cancelar</Button>
          <Button onClick={handleRegister}>Registrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRegisterMany} onClose={() => setOpenRegisterMany(false)}>
        <DialogTitle>Registrar Varias Sucursales</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            {['nombre', 'telefono', 'horario', 'ciudad', 'zona', 'direccion'].map((field) => (
              <Grid item xs={field === 'direccion' ? 12 : 6} key={field}>
                <TextField
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
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


      <Dialog open={openUpdateMany} onClose={() => setOpenUpdateMany(false)}>
        <DialogTitle>Actualizar múltiples</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}><TextField label="ID" fullWidth value={editData.id || ''} onChange={(e) => setEditData({ ...editData, id: e.target.value })} /></Grid>
            {['nombre', 'telefono', 'horario', 'ciudad', 'zona', 'direccion'].map((field) => (
              <Grid item xs={field === 'direccion' ? 12 : 6} key={field}>
                <TextField label={field} fullWidth value={editData[field as keyof typeof editData]} onChange={(e) => setEditData({ ...editData, [field]: e.target.value })} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddToUpdate}>Agregar a actualizaciones</Button>
          <Button onClick={handleBulkUpdate}>Actualizar todas</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openDeleteMany} onClose={() => setOpenDeleteMany(false)}>
        <DialogTitle>Eliminar múltiples</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="IDs separados por coma"
            value={idToDelete}
            onChange={(e) => setIdToDelete(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteBulk} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      

      <Snackbar open={snackbar.open} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} autoHideDuration={3000} />
    </Box>
  )
}
