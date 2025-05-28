import { apiService } from './api';
import type { User, UserFormData } from '../types';

export const userService = {
  // Obtener todos los usuarios
  async getAll(): Promise<User[]> {
    const response = await apiService.get<User[]>('/usuarios');
    return response.data || [];
  },

  // Crear nuevo usuario
  async create(userData: UserFormData): Promise<User> {
    console.log('🚀 userService.create - Datos recibidos:', userData);
    
    const formData = new FormData();
    
    formData.append('nombre', userData.nombre);
    formData.append('apellido', userData.apellido);
    formData.append('documento', userData.documento);
    formData.append('contrasena', userData.contrasena);
    
    if (userData.imagen) {
      console.log('📷 Imagen detectada:', {
        name: userData.imagen.name,
        size: userData.imagen.size,
        type: userData.imagen.type
      });
      formData.append('imagen', userData.imagen);
    } else {
      console.log('❌ No hay imagen para subir');
    }

    // Log del FormData
    console.log('📤 FormData que se enviará:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    try {
      const response = await apiService.postFormData<User>('/usuarios', formData);
      console.log('✅ Respuesta del servidor:', response);
      return response.body || response.data!;
    } catch (error) {
      console.error('💥 Error en userService.create:', error);
      throw error;
    }
  },

  // Actualizar usuario
  async update(id: number, userData: UserFormData): Promise<User> {
    console.log('🔄 userService.update - ID:', id, 'Datos:', userData);
    
    const formData = new FormData();
    
    formData.append('idUsuario', id.toString());
    formData.append('nombre', userData.nombre);
    formData.append('apellido', userData.apellido);
    formData.append('documento', userData.documento);
    formData.append('contrasena', userData.contrasena);
    
    if (userData.imagen) {
      console.log('📷 Nueva imagen para actualizar:', {
        name: userData.imagen.name,
        size: userData.imagen.size,
        type: userData.imagen.type
      });
      formData.append('imagen', userData.imagen);
    }

    try {
      const response = await apiService.putFormData<User>('/usuarios', formData);
      console.log('✅ Usuario actualizado:', response);
      return response.body || response.data!;
    } catch (error) {
      console.error('💥 Error en userService.update:', error);
      throw error;
    }
  },

  // Eliminar usuario
  async delete(id: number): Promise<void> {
    await apiService.delete('/usuarios', { idUsuario: id });
  }
};