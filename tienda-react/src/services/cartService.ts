import { apiService } from './api';
import  type { CartItem, CartFormData } from '../types';

export const cartService = {
  // Obtener todos los items del carrito
  async getAll(): Promise<CartItem[]> {
    const response = await apiService.get<CartItem[]>('/carrito');
    return response.data || [];
  },

  // Agregar item al carrito
  async create(cartData: CartFormData): Promise<CartItem> {
    const response = await apiService.post<CartItem>('/carrito', cartData);
    return response.body || response.data!;
  },

  // Actualizar item del carrito
  async update(id: number, cartData: CartFormData): Promise<CartItem> {
    const data = {
      idCompra: id,
      ...cartData
    };
    const response = await apiService.put<CartItem>('/carrito', data);
    return response.body || response.data!;
  },

  // Eliminar item del carrito
  async delete(id: number): Promise<void> {
    await apiService.delete('/carrito', { idCompra: id });
  }
};