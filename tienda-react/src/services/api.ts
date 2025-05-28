import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type  { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para respuestas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Métodos genéricos para requests JSON
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url, { data });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método especial para multipart/form-data (archivos)
  async postFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      console.log('🌐 API postFormData - URL:', url);
      console.log('📦 FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Respuesta exitosa del servidor:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('💥 Error en postFormData:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number, statusText?: string, data?: any } };
        console.error('📋 Detalles del error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data
        });
      }
      throw this.handleError(error);
    }
  }

  async putFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      console.log('🌐 API putFormData - URL:', url);
      console.log('📦 FormData entries:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ PUT FormData exitoso:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('💥 Error en putFormData:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number, statusText?: string, data?: any } };
        console.error('📋 Detalles del error PUT:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data
        });
      }
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { msg?: string } } };
      if (axiosError.response?.data?.msg) {
        return new Error(axiosError.response.data.msg);
      }
    }
    
    if (error instanceof Error && error.message) {
      return new Error(error.message);
    }
    
    return new Error('Error desconocido en la API');
  }

  // Método para obtener URL completa de imagen
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  }
}

// Crear una instancia del servicio y exportarla
const apiService = new ApiService();

// Exportar tanto la instancia como la clase
export { apiService, ApiService };
export default apiService;