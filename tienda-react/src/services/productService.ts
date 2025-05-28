import { apiService } from './api';
import type  { Product, ProductFormData } from '../types';

export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    const response = await apiService.get<Product[]>('/productos');
    return response.data || [];
  },

  // Crear nuevo producto
  async create(productData: ProductFormData): Promise<Product> {
    console.log('🚀 productService.create - Datos recibidos:', productData);
    
    const formData = new FormData();
    
    formData.append('cantidad', productData.cantidad.toString());
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', productData.precio.toString());
    formData.append('unidad', productData.unidad);
    formData.append('idCategoria', productData.idCategoria.toString());
    
    if (productData.imagen) {
      console.log('📷 Imagen de producto detectada:', {
        name: productData.imagen.name,
        size: productData.imagen.size,
        type: productData.imagen.type
      });
      formData.append('imagen', productData.imagen);
    } else {
      console.log('❌ No hay imagen de producto para subir');
    }

    // Log del FormData
    console.log('📤 FormData del producto que se enviará:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    try {
      const response = await apiService.postFormData<Product>('/productos', formData);
      console.log('✅ Producto creado exitosamente:', response);
      return response.body || response.data!;
    } catch (error) {
      console.error('💥 Error en productService.create:', error);
      throw error;
    }
  },

  // Actualizar producto
  async update(id: number, productData: ProductFormData): Promise<Product> {
    console.log('🔄 productService.update - ID:', id, 'Datos:', productData);
    
    const formData = new FormData();
    
    formData.append('idProducto', id.toString());
    formData.append('cantidad', productData.cantidad.toString());
    formData.append('descripcion', productData.descripcion);
    formData.append('precio', productData.precio.toString());
    formData.append('unidad', productData.unidad);
    formData.append('idCategoria', productData.idCategoria.toString());
    
    if (productData.imagen) {
      console.log('📷 Nueva imagen de producto para actualizar:', {
        name: productData.imagen.name,
        size: productData.imagen.size,
        type: productData.imagen.type
      });
      formData.append('imagen', productData.imagen);
    }

    try {
      const response = await apiService.putFormData<Product>('/productos', formData);
      console.log('✅ Producto actualizado:', response);
      return response.body || response.data!;
    } catch (error) {
      console.error('💥 Error en productService.update:', error);
      throw error;
    }
  },

  // Eliminar producto
  async delete(id: number): Promise<void> {
    await apiService.delete('/productos', { idProducto: id });
  }
};