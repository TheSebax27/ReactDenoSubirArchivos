import { apiService } from './api';
import type { Category, CategoryFormData } from '../types';

export const categoryService = {
  // Obtener todas las categorías
  async getAll(): Promise<Category[]> {
    const response = await apiService.get<Category[]>('/categoria');
    return response.data || [];
  },

  // Crear nueva categoría
  async create(categoryData: CategoryFormData): Promise<Category> {
    const response = await apiService.post<Category>('/categoria', categoryData);
    return response.body || response.data!;
  },

  // Actualizar categoría
  async update(id: number, categoryData: CategoryFormData): Promise<Category> {
    const data = {
      idCategoria: id,
      ...categoryData
    };
    const response = await apiService.put<Category>('/categoria', data);
    return response.body || response.data!;
  },

  // Eliminar categoría
  async delete(id: number): Promise<void> {
    await apiService.delete('/categoria', { idCategoria: id });
  }
};