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
  