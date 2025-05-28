import React, { useState, useEffect } from 'react';
import type  { Product, ProductFormData, Category } from '../../types';
import { Loading } from '../common/Loading';
import { apiService } from '../../services/api';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    cantidad: 0,
    descripcion: '',
    precio: 0,
    unidad: '',
    idCategoria: 0,
    imagen: undefined
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        cantidad: initialData.cantidad,
        descripcion: initialData.descripcion,
        precio: initialData.precio,
        unidad: initialData.unidad,
        idCategoria: initialData.idCategoria,
        imagen: undefined
      });
      
      if (initialData.urlImagen) {
        setImagePreview(apiService.getImageUrl(initialData.urlImagen));
      }
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.unidad.trim()) {
      newErrors.unidad = 'La unidad es requerida';
    }

    if (formData.idCategoria === 0) {
      newErrors.idCategoria = 'Debe seleccionar una categoría';
    }

    if (formData.cantidad < 0) {
      newErrors.cantidad = 'La cantidad no puede ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    
    if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imagen: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WEBP)'
        }));
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imagen: 'La imagen no puede superar los 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        imagen: file
      }));

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Limpiar error de imagen
      if (errors.imagen) {
        setErrors(prev => ({
          ...prev,
          imagen: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imagen: undefined
    }));
    setImagePreview('');
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="descripcion" className="form-label">
            Descripción *
          </label>
          <input
            type="text"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={`form-input ${errors.descripcion ? 'error' : ''}`}
            placeholder="Ej: Smartphone Samsung Galaxy..."
            disabled={loading}
          />
          {errors.descripcion && (
            <span className="error-text">{errors.descripcion}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="idCategoria" className="form-label">
            Categoría *
          </label>
          <select
            id="idCategoria"
            name="idCategoria"
            value={formData.idCategoria}
            onChange={handleChange}
            className={`form-select ${errors.idCategoria ? 'error' : ''}`}
            disabled={loading}
          >
            <option value={0}>Seleccionar categoría...</option>
            {categories.map(category => (
              <option key={category.idCategoria} value={category.idCategoria}>
                {category.nombreCategoria}
              </option>
            ))}
          </select>
          {errors.idCategoria && (
            <span className="error-text">{errors.idCategoria}</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="precio" className="form-label">
            Precio *
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`form-input ${errors.precio ? 'error' : ''}`}
            placeholder="0.00"
            disabled={loading}
          />
          {errors.precio && (
            <span className="error-text">{errors.precio}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cantidad" className="form-label">
            Cantidad
          </label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            min="0"
            className={`form-input ${errors.cantidad ? 'error' : ''}`}
            placeholder="0"
            disabled={loading}
          />
          {errors.cantidad && (
            <span className="error-text">{errors.cantidad}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="unidad" className="form-label">
            Unidad *
          </label>
          <input
            type="text"
            id="unidad"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            className={`form-input ${errors.unidad ? 'error' : ''}`}
            placeholder="Ej: unidad, kg, litro..."
            disabled={loading}
          />
          {errors.unidad && (
            <span className="error-text">{errors.unidad}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="imagen" className="form-label">
          Imagen del producto
        </label>
        <div className="image-upload-container">
          <input
            type="file"
            id="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input-file"
            disabled={loading}
          />
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={removeImage}
                className="btn btn-danger btn-small remove-image"
                disabled={loading}
              >
                ✕ Quitar imagen
              </button>
            </div>
          )}
        </div>
        {errors.imagen && (
          <span className="error-text">{errors.imagen}</span>
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