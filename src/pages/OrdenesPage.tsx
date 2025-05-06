import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  Paper,
  Pagination,
  Fade,
  IconButton,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Receipt as ReceiptIcon,
  CalendarToday as CalendarTodayIcon,
  Payment as PaymentIcon,
  LocalShipping as LocalShippingIcon,
  Search as SearchIcon,
  Add as AddIcon,
  RemoveCircle as RemoveCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { useOrdenes } from '../hooks/useOrdenes'
import { Orden, Platillo } from '../types'

interface MenuItemOption {
  _id: string
  nombre: string
  precio: number
}

const ORDERS_PER_PAGE = 10
const STATUS_OPTIONS = ['pendiente', 'preparando', 'en camino', 'entregado', 'cancelado']
const IVA_RATE = 0.12

export default function OrdenesPage() {
  // --- LIST DATA & REFRESH ---
  const { data: ordenes, loading, error, refetch } = useOrdenes()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('')

  // --- CREATE ORDER STATE ---
  const [openCreate, setOpenCreate] = useState(false)
  const [newOrder, setNewOrder] = useState({
    usuarioId: '',
    sucursalId: '',
    origen: '',
    metodo_pago: '',
    platillos: [] as {
      itemId: string
      nombre: string
      cantidad: number
      precio_unitario: number
    }[],
  })
  const [newItemId, setNewItemId] = useState('')
  const [newItemQty, setNewItemQty] = useState(1)

  // --- EDIT ORDER STATE (simplified) ---
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null)
  const [editData, setEditData] = useState({ estado: '', origen: '' })
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)

  // --- BULK CRUD STATE (unchanged) ---
  const [openBulkCreate, setOpenBulkCreate] = useState(false)
  const [openBulkUpdate, setOpenBulkUpdate] = useState(false)
  const [openBulkDelete, setOpenBulkDelete] = useState(false)
  const [bulkCreateJson, setBulkCreateJson] = useState('')
  const [bulkUpdateJson, setBulkUpdateJson] = useState('')
  const [bulkDeleteJson, setBulkDeleteJson] = useState('')

  // --- MENU OPTIONS (platillos) ---
  const [menuOptions, setMenuOptions] = useState<MenuItemOption[]>([])
  useEffect(() => {
    axios
      .get<MenuItemOption[]>('http://localhost:3000/DB/menu')
      .then(res => setMenuOptions(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Error cargando menú:', err)
        setMenuOptions([])
      })
  }, [])

  // --- FILTER & PAGINATE ---
  const filtered = ordenes.filter(o => {
    const ms =
      o._id.includes(searchTerm) ||
      o.usuarioId.includes(searchTerm) ||
      o.sucursalId.includes(searchTerm)
    const fe = filterEstado ? o.estado === filterEstado : true
    return ms && fe
  })
  const pageCount = Math.ceil(filtered.length / ORDERS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE)
  const handlePageChange = (_: any, v: number) => setPage(v)

  // --- CREATE ORDER HANDLERS ---
  const handleAddNewItem = () => {
    if (!newItemId) return
    const item = menuOptions.find(m => m._id === newItemId)!
    setNewOrder(n => ({
      ...n,
      platillos: [
        ...n.platillos,
        { itemId: item._id, nombre: item.nombre, cantidad: newItemQty, precio_unitario: item.precio },
      ],
    }))
    setNewItemId('')
    setNewItemQty(1)
  }
  const handleRemoveNewItem = (i: number) => {
    setNewOrder(n => {
      const arr = [...n.platillos]
      arr.splice(i, 1)
      return { ...n, platillos: arr }
    })
  }
  const handleCreateSave = async () => {
    const subtotal = newOrder.platillos.reduce((s, p) => s + p.cantidad * p.precio_unitario, 0)
    const iva = parseFloat((subtotal * IVA_RATE).toFixed(2))
    const total = parseFloat((subtotal + iva).toFixed(2))
    const payload = {
      usuarioId: newOrder.usuarioId,
      sucursalId: newOrder.sucursalId,
      origen: newOrder.origen,
      metodoPago: newOrder.metodo_pago,
      platillos: newOrder.platillos.map(p => ({
        platilloId: p.itemId,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioUnitario: p.precio_unitario,
      })),
      subtotal,
      iva,
      total,
      fecha: new Date().toISOString(),
    }
    try {
      await axios.post('http://localhost:3000/DB/ordenes', payload)
      setOpenCreate(false)
      setNewOrder({ usuarioId: '', sucursalId: '', origen: '', metodo_pago: '', platillos: [] })
      refetch()
    } catch (e: any) {
      alert('Error al crear orden: ' + e.message)
    }
  }

  // --- EDIT ORDER HANDLERS (solo origen y estado) ---
  const handleEditClick = (o: Orden) => {
    setSelectedOrder(o)
    setEditData({ estado: o.estado, origen: o.origen })
    setOpenEdit(true)
  }
  const handleEditSave = async () => {
    if (!selectedOrder) return
    const payload = { estado: editData.estado, origen: editData.origen }
    try {
      await axios.put(`http://localhost:3000/DB/ordenes/${selectedOrder._id}`, payload)
      setOpenEdit(false)
      refetch()
    } catch (e: any) {
      alert('Error al editar orden: ' + e.message)
    }
  }

  // --- DELETE ORDER HANDLER ---
  const handleDelete = async () => {
    if (!deleteOrderId) return
    try {
      await axios.delete(`http://localhost:3000/DB/ordenes/${deleteOrderId}`)
      setDeleteOrderId(null)
      refetch()
    } catch (e: any) {
      alert('Error al eliminar orden: ' + e.message)
    }
  }

  // --- BULK CRUD HANDLERS (unchanged) ---
  const handleBulkCreate = async () => { /* ... */ }
  const handleBulkUpdate = async () => { /* ... */ }
  const handleBulkDelete = async () => { /* ... */ }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header + Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Listado de Órdenes</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Crear Orden
          </Button>
          <Button variant="outlined" onClick={() => setOpenBulkCreate(true)}>
            Bulk Create
          </Button>
          <Button variant="outlined" onClick={() => setOpenBulkUpdate(true)}>
            Bulk Update
          </Button>
          <Button variant="outlined" color="error" onClick={() => setOpenBulkDelete(true)}>
            Bulk Delete
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar ID / usuario / sucursal"
          size="small"
          fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Filtrar estado"
          size="small"
          sx={{ width: 200 }}
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          {STATUS_OPTIONS.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
        </TextField>
      </Box>

      {/* Pagination */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Página {page} de {pageCount}
      </Typography>
      {!loading && pageCount > 1 && (
        <Pagination count={pageCount} page={page} onChange={handlePageChange} sx={{ mb: 3 }} color="primary" />
      )}

      {/* Loading / Error */}
      {loading && <Typography>Cargando órdenes…</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {/* Orders List */}
      {paginated.map((o, idx) => (
        <Fade in key={o._id} timeout={600 + idx * 100}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={9}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ReceiptIcon fontSize="large" />
                  <Box>
                    <Typography fontWeight="bold">{o._id} — {o.estado}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon fontSize="small" /><Typography variant="body2">{o.fecha}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PaymentIcon fontSize="small" /><Typography variant="body2">{o.metodo_pago} — Q{o.total.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon fontSize="small" /><Typography variant="body2">Origen: {o.origen}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                <IconButton onClick={() => handleEditClick(o)}><EditIcon color="primary" /></IconButton>
                <IconButton onClick={() => setDeleteOrderId(o._id)}><DeleteIcon color="error" /></IconButton>
              </Grid>
            </Grid>

            {/* Platillos */}
            <Box sx={{ mt: 2, pl: 4 }}>
              {o.platillos.map((p, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{p.cantidad}× {p.nombre}</Typography>
                  <Typography>Q{(p.cantidad * p.precio_unitario).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Fade>
      ))}

      {/* Crear Orden Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Crear Nueva Orden</DialogTitle>
        <DialogContent>
          <TextField label="Usuario ID" fullWidth margin="dense"
            value={newOrder.usuarioId} onChange={e => setNewOrder({ ...newOrder, usuarioId: e.target.value })} />
          <TextField label="Sucursal ID" fullWidth margin="dense"
            value={newOrder.sucursalId} onChange={e => setNewOrder({ ...newOrder, sucursalId: e.target.value })} />
          <TextField label="Origen" fullWidth margin="dense"
            value={newOrder.origen} onChange={e => setNewOrder({ ...newOrder, origen: e.target.value })} />
          <TextField select label="Método de Pago" fullWidth margin="dense"
            value={newOrder.metodo_pago} onChange={e => setNewOrder({ ...newOrder, metodo_pago: e.target.value })}>
            {['efectivo', 'tarjeta', 'paypal'].map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
          </TextField>

          {/* Agregar Platillo */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
            <TextField select label="Platillo"
              value={newItemId} onChange={e => setNewItemId(e.target.value)} sx={{ flex: 3 }}>
              {menuOptions.length > 0
                ? menuOptions.map(m => <MenuItem key={m._id} value={m._id}>{m.nombre}</MenuItem>)
                : <MenuItem disabled>No hay platillos</MenuItem>
              }
            </TextField>
            <TextField label="Cantidad" type="number" sx={{ width: 100 }}
              value={newItemQty} onChange={e => setNewItemQty(parseInt(e.target.value) || 1)} />
            <Button onClick={handleAddNewItem}>+ Agregar</Button>
          </Box>

          {/* Lista provisional */}
          {newOrder.platillos.map((p, i) => (
            <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
              <Typography>{p.cantidad}× {p.nombre}</Typography>
              <Box>
                <Typography component="span">Q{(p.cantidad * p.precio_unitario).toFixed(2)}</Typography>
                <IconButton size="small" onClick={() => handleRemoveNewItem(i)}>
                  <RemoveCircleIcon color="error" />
                </IconButton>
              </Box>
            </Box>
          ))}

          {/* Totales */}
          <Box sx={{ borderTop: '1px solid', mt: 2, pt: 1 }}>
            {(() => {
              const sub = newOrder.platillos.reduce((s, p) => s + p.cantidad * p.precio_unitario, 0)
              const iv = parseFloat((sub * IVA_RATE).toFixed(2))
              const tt = parseFloat((sub + iv).toFixed(2))
              return (
                <Typography fontWeight="bold">
                  Subtotal: Q{sub.toFixed(2)} &nbsp; IVA: Q{iv.toFixed(2)} &nbsp; Total: Q{tt.toFixed(2)}
                </Typography>
              )
            })()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateSave}>Crear Orden</Button>
        </DialogActions>
      </Dialog>

      {/* Editar Orden Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Orden</DialogTitle>
        <DialogContent>
          <TextField select label="Estado" fullWidth margin="dense"
            value={editData.estado} onChange={e => setEditData({ ...editData, estado: e.target.value })}>
            {STATUS_OPTIONS.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
          </TextField>
          <TextField label="Origen" fullWidth margin="dense"
            value={editData.origen} onChange={e => setEditData({ ...editData, origen: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleEditSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Eliminar Orden Dialog */}
      <Dialog open={!!deleteOrderId} onClose={() => setDeleteOrderId(null)}>
        <DialogTitle>¿Eliminar orden?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteOrderId(null)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Create Dialog */}
      <Dialog open={openBulkCreate} onClose={() => setOpenBulkCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Create Órdenes</DialogTitle>
        <DialogContent>
          <Typography variant="caption" display="block" mb={1}>
            Pega aquí un array JSON con las órdenes a crear
          </Typography>
          <TextField multiline minRows={6} fullWidth variant="outlined"
            value={bulkCreateJson} onChange={e => setBulkCreateJson(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkCreate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleBulkCreate}>Crear Múltiples</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={openBulkUpdate} onClose={() => setOpenBulkUpdate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Update Órdenes</DialogTitle>
        <DialogContent>
          <Typography variant="caption" display="block" mb={1}>
            Pega aquí un array JSON de objetos {'{ filter, data }'} para actualizar
          </Typography>
          <TextField multiline minRows={6} fullWidth variant="outlined"
            value={bulkUpdateJson} onChange={e => setBulkUpdateJson(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkUpdate(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleBulkUpdate}>Actualizar Múltiples</Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={openBulkDelete} onClose={() => setOpenBulkDelete(false)} fullWidth maxWidth="sm">
        <DialogTitle>Bulk Delete Órdenes</DialogTitle>
        <DialogContent>
          <Typography variant="caption" display="block" mb={1}>
            Pega aquí un array JSON con los filtros de las órdenes a eliminar
          </Typography>
          <TextField multiline minRows={6} fullWidth variant="outlined"
            value={bulkDeleteJson} onChange={e => setBulkDeleteJson(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDelete(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>Eliminar Múltiples</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}