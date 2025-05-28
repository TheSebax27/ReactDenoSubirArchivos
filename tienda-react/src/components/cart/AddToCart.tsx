import React, { useState, useEffect } from 'react';
import type { CartItem, CartFormData, User, Product } from '../../types';
import { Loading } from '../common/Loading';
import { apiService } from '../../services/api';

interface AddToCartProps {
  initialData?: CartItem;
  users: User[];
  products: Product[];
  onSubmit: (data: CartFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  initialData,
  users,
  products,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CartFormData>({
    idUsuario: 0,
    idProducto: 0
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Información del producto seleccionado para mostrar preview
  const selectedProduct = products.find(p => p.idProducto === formData.idProducto);
  const selectedUser = users.find(u => u.idUsuario === formData.idUsuario);

  useEffect(() => {
    if (initialData) {
      setFormData({
        idUsuario: initialData.idUsuario,
        idProducto: initialData.idProducto
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.idUsuario === 0) {
      newErrors.idUsuario = 'Debe seleccionar un usuario';
    }

    if (formData.idProducto === 0) {
      newErrors.idProducto = 'Debe seleccionar un producto';
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
    
    // Limpiar error del campo cuando el usuario haga una selección
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  return (
    <form onSubmit={handleSubmit} className="add-to-cart-form">
      <div className="form-group">
        <label htmlFor="idUsuario" className="form-label">
          Usuario *
        </label>
        <select
          id="idUsuario"
          name="idUsuario"
          value={formData.idUsuario}
          onChange={handleChange}
          className={`form-select ${errors.idUsuario ? 'error' : ''}`}
          disabled={loading}
        >
          <option value={0}>Seleccionar usuario...</option>
          {users.map(user => (
            <option key={user.idUsuario} value={user.idUsuario}>
              {user.nombre} {user.apellido} - {user.documento}
            </option>
          ))}
        </select>
        {errors.idUsuario && (
          <span className="error-text">{errors.idUsuario}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="idProducto" className="form-label">
          Producto *
        </label>
        <select
          id="idProducto"
          name="idProducto"
          value={formData.idProducto}
          onChange={handleChange}
          className={`form-select ${errors.idProducto ? 'error' : ''}`}
          disabled={loading}
        >
          <option value={0}>Seleccionar producto...</option>
          {products.map(product => (
            <option key={product.idProducto} value={product.idProducto}>
              {product.descripcion} - {formatPrice(product.precio)}
            </option>
          ))}
        </select>
        {errors.idProducto && (
          <span className="error-text">{errors.idProducto}</span>
        )}
      </div>

      {/* Preview del producto seleccionado */}
      {selectedProduct && (
        <div className="product-preview">
          <h4>Vista previa del producto:</h4>
          <div className="preview-card">
            <div className="preview-image">
              {selectedProduct.urlImagen ? (
                <img 
                  src={apiService.getImageUrl(selectedProduct.urlImagen)} 
                  alt={selectedProduct.descripcion}
                  className="preview-img"
                />
              ) : (
                <div className="preview-placeholder">📦</div>
              )}
            </div>
            <div className="preview-info">
              <h5>{selectedProduct.descripcion}</h5>
              <p><strong>Precio:</strong> {formatPrice(selectedProduct.precio)}</p>
              <p><strong>Cantidad disponible:</strong> {selectedProduct.cantidad} {selectedProduct.unidad}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview del usuario seleccionado */}
      {selectedUser && (
        <div className="user-preview">
          <h4>Usuario seleccionado:</h4>
          <div className="preview-card">
            <div className="preview-image">
              {selectedUser.urlImagen ? (
                <img 
                  src={apiService.getImageUrl(selectedUser.urlImagen)} 
                  alt={`${selectedUser.nombre} ${selectedUser.apellido}`}
                  className="preview-img user-img"
                />
              ) : (
                <div className="preview-placeholder">👤</div>
              )}
            </div>
            <div className="preview-info">
              <h5>{selectedUser.nombre} {selectedUser.apellido}</h5>
              <p><strong>Documento:</strong> {selectedUser.documento}</p>
            </div>
          </div>
        </div>
      )}

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
            initialData ? 'Actualizar' : 'Agregar al Carrito'
          )}
        </button>
      </div>
    </form>
  );
};