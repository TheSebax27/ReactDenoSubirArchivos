import React, { useState } from 'react';
import type { Product, Category, User, CartFormData } from '../../types';
import { apiService } from '../../services/api';
import { cartService } from '../../services/cartService';

interface ProductCardProps {
  product: Product;
  categories: Category[];
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart?: (productId: number, userId: number) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categories,
  users,
  onEdit,
  onDelete,
  onAddToCart
}) => {
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showUserSelector, setShowUserSelector] = useState(false);

  const categoryName = categories.find(cat => cat.idCategoria === product.idCategoria)?.nombreCategoria || 'Sin categoría';
  const imageUrl = product.urlImagen ? apiService.getImageUrl(product.urlImagen) : '';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!selectedUserId || selectedUserId === 0) {
      alert('Por favor selecciona un usuario');
      return;
    }

    setIsAddingToCart(true);
    try {
      if (onAddToCart) {
        await onAddToCart(product.idProducto, selectedUserId);
      } else {
        const cartData: CartFormData = {
          idUsuario: selectedUserId,
          idProducto: product.idProducto
        };
        await cartService.create(cartData);
      }
      
      setShowUserSelector(false);
      setSelectedUserId(0);
      alert('¡Producto agregado al carrito!');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = product.cantidad === 0;
  const isLowStock = product.cantidad > 0 && product.cantidad <= 5;

  return (
    <div className="product-card-modern">
      {/* Imagen del producto */}
      <div className="product-image-container-modern">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.descripcion}
            className="product-image-modern"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23f1f5f9"/><text x="150" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="40" fill="%2364748b">📦</text></svg>`;
            }}
          />
        ) : (
          <div className="product-image-placeholder-modern">
            <span className="placeholder-icon">📦</span>
            <span className="placeholder-text">Sin imagen</span>
          </div>
        )}
        
        {/* Badges de estado */}
        <div className="product-badges">
          {isOutOfStock && (
            <div className="badge badge-danger">Sin Stock</div>
          )}
          {isLowStock && (
            <div className="badge badge-warning">Stock Bajo</div>
          )}
          <div className="badge badge-category">{categoryName}</div>
        </div>

        {/* Botones de acción rápida */}
        <div className="quick-actions">
          <button
            onClick={onEdit}
            className="quick-btn quick-edit"
            title="Editar producto"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="quick-btn quick-delete"
            title="Eliminar producto"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Contenido del producto */}
      <div className="product-content-modern">
        <div className="product-header-modern">
          <h3 className="product-title-modern">{product.descripcion}</h3>
          <div className="product-price-modern">
            <span className="price-current">{formatPrice(product.precio)}</span>
          </div>
        </div>
        
        <div className="product-details-modern">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-icon">📦</span>
              <span className="detail-label">Stock:</span>
              <span className={`detail-value ${isOutOfStock ? 'text-danger' : isLowStock ? 'text-warning' : 'text-success'}`}>
                {product.cantidad} {product.unidad}
              </span>
            </div>
          </div>
        </div>

        {/* Selector de usuario para agregar al carrito */}
        {showUserSelector && (
          <div className="user-selector-modern">
            <div className="selector-header">
              <h4>Seleccionar Cliente</h4>
              <button
                onClick={() => {
                  setShowUserSelector(false);
                  setSelectedUserId(0);
                }}
                className="close-selector"
              >
                ✕
              </button>
            </div>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="user-select-modern"
              disabled={isAddingToCart}
            >
              <option value={0}>Seleccionar cliente...</option>
              {users.map(user => (
                <option key={user.idUsuario} value={user.idUsuario}>
                  {user.nombre} {user.apellido} - {user.documento}
                </option>
              ))}
            </select>
            <div className="selector-actions">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || selectedUserId === 0}
                className="btn-modern btn-confirm"
              >
                {isAddingToCart ? (
                  <>
                    <span className="spinner-small"></span>
                    Agregando...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✓</span>
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Acciones principales */}
        <div className="product-actions-modern">
          <button
            onClick={() => setShowUserSelector(true)}
            className={`btn-modern btn-cart ${isOutOfStock ? 'btn-disabled' : 'btn-primary'}`}
            disabled={isOutOfStock || showUserSelector}
            title={isOutOfStock ? 'Producto sin stock' : 'Agregar al carrito'}
          >
            <span className="btn-icon">🛒</span>
            <span className="btn-text">
              {isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
            </span>
          </button>
        </div>
      </div>
      
      <div className="product-hover-overlay"></div>
    </div>
  );
};

export { ProductCard };
export default ProductCard;