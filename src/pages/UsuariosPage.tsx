import { useState } from 'react'
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
  MenuItem,
} from '@mui/material'
import { useUsuarios } from '../hooks/useUsuarios'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import { Usuario } from '../types'

const USERS_PER_PAGE = 10

export default function UsuariosPage() {
  const { data: usuarios, loading, error, refetch } = useUsuarios()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRol, setFilterRol] = useState('')

  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
  const [editData, setEditData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    rol: '',
    ciudad: '',
    zona: '',
    direccion: '',
    contraseña: '',
  })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRol = filterRol ? u.rol === filterRol : true
    return matchesSearch && matchesRol
  })

  const startIndex = (page - 1) * USERS_PER_PAGE
  const paginatedUsuarios = filteredUsuarios.slice(startIndex, startIndex + USERS_PER_PAGE)

  const handleDelete = async () => {
    if (!deleteUserId) return
    await axios.delete(`http://localhost:3000/DB/usuarios/${deleteUserId}`)
    setDeleteUserId(null)
    refetch()
  }

  const handleEditClick = (user: Usuario) => {
    setSelectedUser(user)
    setEditData({
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      rol: user.rol,
      ciudad: user.direccion?.municipio ?? '',
      zona: user.direccion?.zona?.toString() ?? '',
      direccion: user.direccion?.calle ?? '',
      contraseña: '',
    })
    setIsEditOpen(true)
  }

  const handleEditSave = async () => {
    if (!selectedUser) return

    const updated = {
      nombre: editData.nombre,
      correo: editData.correo,
      telefono: editData.telefono,
      rol: editData.rol,
      direccion: {
        municipio: editData.ciudad,
        zona: parseInt(editData.zona),
        calle: editData.direccion,
      },
    }

    await axios.put(`http://localhost:3000/DB/usuarios/${selectedUser._id}`, updated)
    setIsEditOpen(false)
    refetch()
  }

  const handleRegisterSave = async () => {
    const nuevo = {
      nombre: editData.nombre,
      correo: editData.correo,
      telefono: editData.telefono,
      rol: editData.rol,
      contraseña: editData.contraseña,
      direccion: `${editData.direccion}, zona ${editData.zona}, ${editData.ciudad}`,
    }
  
    await axios.post(`http://localhost:3000/DB/auth/register`, nuevo)
    setIsRegisterOpen(false)
    setEditData({ nombre: '', correo: '', telefono: '', rol: '', ciudad: '', zona: '', direccion: '', contraseña: '' })
    refetch()
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Lista de Usuarios</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsRegisterOpen(true)}>
          Registrar Usuario
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre o correo"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Filtrar por rol"
          value={filterRol}
          onChange={(e) => setFilterRol(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="cliente">Cliente</MenuItem>
          <MenuItem value="repartidor">Repartidor</MenuItem>
        </TextField>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
        Página {page}
      </Typography>

      {!loading && filteredUsuarios.length > USERS_PER_PAGE && (
        <Pagination
          count={Math.ceil(filteredUsuarios.length / USERS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          color="primary"
          sx={{ mb: 3 }}
        />
      )}

      {loading && <Typography>Cargando...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {paginatedUsuarios.map((usuario, index) => (
        <Fade in={true} timeout={600 + index * 100} key={usuario._id}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 24 }}>
                  {usuario.nombre.charAt(0)}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold" fontSize={18}>{usuario.nombre}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    <Typography>{usuario.correo}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" />
                    <Typography>{usuario.telefono}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" />
                    <Typography>Rol: {usuario.rol}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography>Ciudad: {usuario.direccion?.municipio ?? 'No especificada'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography>Zona: {usuario.direccion?.zona ?? 'No especificada'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography>Dirección: {usuario.direccion?.calle ?? 'No especificada'}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <IconButton onClick={() => handleEditClick(usuario)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => setDeleteUserId(usuario._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Fade>
      ))}

      <Dialog open={!!deleteUserId} onClose={() => setDeleteUserId(null)}>
        <DialogTitle>¿Eliminar usuario?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" fullWidth value={editData.nombre} onChange={(e) => setEditData({ ...editData, nombre: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo" fullWidth value={editData.correo} onChange={(e) => setEditData({ ...editData, correo: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" fullWidth value={editData.telefono} onChange={(e) => setEditData({ ...editData, telefono: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Rol" fullWidth value={editData.rol} onChange={(e) => setEditData({ ...editData, rol: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" fullWidth value={editData.ciudad} onChange={(e) => setEditData({ ...editData, ciudad: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Zona" fullWidth type="number" value={editData.zona} onChange={(e) => setEditData({ ...editData, zona: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField label="Dirección" fullWidth value={editData.direccion} onChange={(e) => setEditData({ ...editData, direccion: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Registrar Usuario</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField label="Nombre" fullWidth value={editData.nombre} onChange={(e) => setEditData({ ...editData, nombre: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Correo" fullWidth value={editData.correo} onChange={(e) => setEditData({ ...editData, correo: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Teléfono" fullWidth value={editData.telefono} onChange={(e) => setEditData({ ...editData, telefono: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Contraseña" fullWidth type="password" value={editData.contraseña} onChange={(e) => setEditData({ ...editData, contraseña: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Rol" fullWidth value={editData.rol} onChange={(e) => setEditData({ ...editData, rol: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ciudad" fullWidth value={editData.ciudad} onChange={(e) => setEditData({ ...editData, ciudad: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Zona" fullWidth type="number" value={editData.zona} onChange={(e) => setEditData({ ...editData, zona: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField label="Dirección" fullWidth value={editData.direccion} onChange={(e) => setEditData({ ...editData, direccion: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRegisterOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleRegisterSave}>Registrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
