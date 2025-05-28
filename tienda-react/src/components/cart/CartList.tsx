import React, { useState, useMemo } from 'react';
import type { CartItem, User, Product } from '../../types';
import { Loading } from '../common/Loading';
import { ConfirmModal } from '../common/Modal';
import { CartItemComponent } from './CartItem';

interface CartListProps {
  cartItems: CartItem[];
  users: User[];
  products: Product[];
  loading: boolean;
  error: string | null;
  onRemoveFromCart: (id: number) => Promise<void>;
  onRefreshCart: () => Promise<void>;
}

export const CartList: React.FC<CartListProps> = ({
  cartItems,
  users,
  products,
  loading,
  error,
  onRemoveFromCart,
  onRefreshCart
}) => {
  const [deletingItem, setDeletingItem] = useState<CartItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterUser, setFilterUser] = useState<number | 'all'>('all');

  // Filtrar items del carrito por usuario
  const filteredCartItems = useMemo(() => {
    if (filterUser === 'all') return cartItems;
    return cartItems.filter(item => item.idUsuario === filterUser);
  }, [cartItems, filterUser]);

  // Enriquecer items del carrito con información de usuarios y productos
  const enrichedCartItems = useMemo(() => {
    return filteredCartItems.map(item => {
      const user = users.find(u => u.idUsuario === item.idUsuario);
      const product = products.find(p => p.idProducto === item.idProducto);
      
      return {
        ...item,
        userName: user ? `${user.nombre} ${user.apellido}` : 'Usuario desconocido',
        userDocument: user?.documento || '',
        userImage: user?.urlImagen || '',
        productName: product?.descripcion || 'Producto desconocido',
        productPrice: product?.precio || 0,
        productImage: product?.urlImagen || '',
        productStock: product?.cantidad || 0,
        productUnit: product?.unidad || ''
      };
    });
  }, [filteredCartItems, users, products]);

  // Estadísticas del carrito
  const cartStats = useMemo(() => {
    const totalItems = enrichedCartItems.length;
    const totalValue = enrichedCartItems.reduce((total, item) => total + item.productPrice, 0);
    const uniqueUsers = new Set(enrichedCartItems.map(item => item.idUsuario)).size;
    const uniqueProducts = new Set(enrichedCartItems.map(item => item.idProducto)).size;

    return {
      totalItems,
      totalValue,
      uniqueUsers,
      uniqueProducts
    };
  }, [enrichedCartItems]);

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    setActionLoading(true);
    try {
      await onRemoveFromCart(deletingItem.idCompra);
      setDeletingItem(null);
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await onRefreshCart();
    } catch (error) {
      console.error('Error al actualizar carrito:', error);
    }
  };

  if (loading) {
    return <Loading message="Cargando carrito..." />;
  }

  return (
    <div className="cart-list">
      <div className="section-header">
        <div className="header-content">
          <h2>🛒 Carrito de Compras</h2>
          <button 
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={loading}
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Estadísticas del carrito */}
      {enrichedCartItems.length > 0 && (
        <div className="cart-stats">
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <div className="stat-value">{cartStats.totalItems}</div>
              <div className="stat-label">Items en Carrito</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                }).format(cartStats.totalValue)}
              </div>
              <div className="stat-label">Valor Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{cartStats.uniqueUsers}</div>
              <div className="stat-label">Usuarios</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{cartStats.uniqueProducts}</div>
              <div className="stat-label">Productos Únicos</div>
            </div>
          </div>
        </div>
      )}

      {/* Filtro por usuario */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="user-filter">👤 Filtrar por usuario:</label>
          <select
            id="user-filter"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="form-select"
          >
            <option value="all">Todos los usuarios ({cartItems.length} items)</option>
            {users
              .filter(user => cartItems.some(item => item.idUsuario === user.idUsuario))
              .map(user => {
                const userItemCount = cartItems.filter(item => item.idUsuario === user.idUsuario).length;
                return (
                  <option key={user.idUsuario} value={user.idUsuario}>
                    {user.nombre} {user.apellido} - {user.documento} ({userItemCount} items)
                  </option>
                );
              })
            }
          </select>
        </div>
      </div>

      {/* Lista de items del carrito */}
      <div className="cart-items-container">
        {enrichedCartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Carrito vacío</h3>
            <p>
              {filterUser !== 'all' 
                ? 'Este usuario no tiene productos en el carrito' 
                : 'No hay productos en el carrito'
              }
            </p>
            <p className="empty-suggestion">
              💡 Visita la sección de <strong>Productos</strong> para agregar items al carrito
            </p>
          </div>
        ) : (
          <div className="cart-items-grid">
            {enrichedCartItems.map(item => (
              <CartItemComponent
                key={item.idCompra}
                item={item}
                onDelete={() => setDeletingItem(item)}
                showEditButton={false} // No mostrar botón de editar
              />
            ))}
          </div>
        )}
      </div>

      {/* Resumen del carrito filtrado */}
      {enrichedCartItems.length > 0 && filterUser !== 'all' && (
        <div className="cart-summary">
          <h3>📊 Resumen - {users.find(u => u.idUsuario === filterUser)?.nombre}</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Items en carrito:</span>
              <span className="summary-value">{enrichedCartItems.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valor total:</span>
              <span className="summary-value">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                }).format(
                  enrichedCartItems.reduce((total, item) => total + item.productPrice, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="cart-info">
        <div className="info-card">
          <h4>ℹ️ Información del Carrito</h4>
          <ul>
            <li>Los productos se agregan desde la sección de <strong>Productos</strong></li>
            <li>Cada usuario debe seleccionarse al agregar un producto</li>
            <li>Los items solo pueden ser <strong>eliminados</strong> del carrito</li>
            <li>Para modificar cantidades, elimina y vuelve a agregar el producto</li>
          </ul>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!deletingItem}
        title="Eliminar del Carrito"
        message={`¿Estás seguro de que deseas eliminar "${deletingItem?.productName}" del carrito de ${deletingItem?.userName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  );
};