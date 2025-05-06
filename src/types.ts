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
  