import React, { useState, useEffect } from 'react';
import type { Category, CategoryFormData } from '../../types';
import { Loading } from '../common/Loading';

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    nombreCategoria: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombreCategoria: initialData.nombreCategoria
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombreCategoria.trim()) {
      newErrors.nombreCategoria = 'El nombre de la categoría es requerido';
    } else if (formData.nombreCategoria.trim().length < 2) {
      newErrors.nombreCategoria = 'El nombre debe tener al menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit({
        nombreCategoria: formData.nombreCategoria.trim()
      });
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form">
      <div className="form-group">
        <label htmlFor="nombreCategoria" className="form-label">
          Nombre de la Categoría *
        </label>
        <input
          type="text"
          id="nombreCategoria"
          name="nombreCategoria"
          value={formData.nombreCategoria}
          onChange={handleChange}
          className={`form-input ${errors.nombreCategoria ? 'error' : ''}`}
          placeholder="Ej: Electrónicos, Ropa, Hogar..."
          disabled={loading}
        />
        {errors.nombreCategoria && (
          <span className="error-text">{errors.nombreCategoria}</span>
        )}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <Loading size="small" message="" />
          ) : (
            initialData ? 'Actualizar' : 'Crear'
          )}
        </button>
      </div>
    </form>
  );
};