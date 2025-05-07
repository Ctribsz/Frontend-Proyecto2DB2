// src/types.ts
export interface Direccion {
    calle?: string
    ciudad?: string
    departamento?: string
    codigoPostal?: string
    [key: string]: any // para evitar errores si hay campos no definidos aún
  }
  
  export interface Usuario {
    _id: string
    nombre: string
    correo: string
    contraseña: string
    telefono: string
    direccion: Direccion
    rol: string
    activo: boolean
    fechaRegistro: string
  }

  export interface Platillo {
    itemId: string
    nombre: string
    cantidad: number
    precio_unitario: number
    [key: string]: any
  }
  
  export interface Orden {
    _id: string
    sucursalId: string
    usuarioId: string
    platillos: Platillo[]
    subtotal: number
    iva: number
    total: number
    estado: string
    metodo_pago: string
    fecha: string
    origen: string
    calificacion: number | null
  }
  export interface Menu {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string;
    disponible: boolean;
    ingredientes: string[];
    vegana: boolean;
    fechaCreacion: string; // Puedes usar Date si prefieres manipularla como un objeto Date
  }
  
