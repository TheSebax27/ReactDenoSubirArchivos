// Interfaces para los tipos de datos de la API

export interface Category {
  idCategoria: number;
  nombreCategoria: string;
}

export interface Product {
  idProducto: number;
  cantidad: number;
  descripcion: string;
  precio: number;
  unidad: string;
  urlImagen: string;
  idCategoria: number;
  nombreCategoria?: string; // Para cuando se hace JOIN con categorías
}

export interface User {
  idUsuario: number;
  nombre: string;
  apellido: string;
  urlImagen: string;
  documento: string;
  contrasena: string;
}

export interface CartItem {
  idCompra: number;
  idUsuario: number;
  idProducto: number;
  // Campos adicionales que pueden venir del JOIN
  nombreUsuario?: string;
  apellidoUsuario?: string;
  descripcionProducto?: string;
  precioProducto?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  body?: T;
  msg?: string;
  errors?: { [key: string]: string[] }; // o el tipo real que devuelve tu backend
}

// Tipos para formularios
export interface CategoryFormData {
  nombreCategoria: string;
}

export interface ProductFormData {
  cantidad: number;
  descripcion: string;
  precio: number;
  unidad: string;
  idCategoria: number;
  imagen?: File;
}

export interface UserFormData {
  nombre: string;
  apellido: string;
  documento: string;
  contrasena: string;
  imagen?: File;
}

export interface CartFormData {
  idUsuario: number;
  idProducto: number;
}

// Tipos para estados de carga
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// Tipos para modales y notificaciones
export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface NotificationState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}