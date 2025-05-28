import React, { useState, useMemo } from 'react';
import type { Product, ProductFormData, Category, User, CartFormData } from '../../types';
import { Loading } from '../common/Loading';
import { ConfirmModal, Modal } from '../common/Modal';
import { ProductForm } from './ProductForm';
import { ProductCard } from './ProductCard';
import { BulkUploadProducts } from './BulkUploadProducts';
import { cartService } from '../../services/cartService';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  users: User[];
  loading: boolean;
  error: string | null;
  onCreateProduct: (data: ProductFormData) => Promise<void>;
  onUpdateProduct: (id: number, data: ProductFormData) => Promise<void>;
  onDeleteProduct: (id: number) => Promise<void>;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  users,
  loading,
  error,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filtrar por categoría
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.idCategoria === filterCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por stock
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(product => product.cantidad > 0);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(product => product.cantidad === 0);
    }

    return filtered;
  }, [products, filterCategory, searchTerm, stockFilter]);

  const handleCreate = async (data: ProductFormData) => {
    setActionLoading(true);
    try {
      await onCreateProduct(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUpload = async (productsData: ProductFormData[]) => {
    setActionLoading(true);
    try {
      console.log('🚀 Iniciando carga masiva de productos:', productsData.length);
      
      // Crear productos uno por uno
      for (let i = 0; i < productsData.length; i++) {
        const productData = productsData[i];
        console.log(`📦 Creando producto ${i + 1}/${productsData.length}:`, productData.descripcion);
        await onCreateProduct(productData);
      }
      
      setShowBulkUploadModal(false);
      alert(`¡${productsData.length} productos cargados exitosamente en la base de datos!`);
      
    } catch (error) {
      console.error('💥 Error en carga masiva:', error);
      alert(`Error al cargar productos: ${error.message || error}`);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    setActionLoading(true);
    try {
      await onUpdateProduct(editingProduct.idProducto, data);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    
    setActionLoading(true);
    try {
      await onDeleteProduct(deletingProduct.idProducto);
      setDeletingProduct(null);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddToCart = async (productId: number, userId: number) => {
    try {
      const cartData: CartFormData = {
        idUsuario: userId,
        idProducto: productId
      };
      await cartService.create(cartData);
      console.log('✅ Producto agregado al carrito exitosamente');
    } catch (error) {
      console.error('💥 Error al agregar al carrito:', error);
      throw error;
    }
  };

  if (loading) {
    return <Loading message="Cargando productos..." />;
  }

  // Estadísticas de productos
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.cantidad > 0).length;
  const outOfStockProducts = products.filter(p => p.cantidad === 0).length;

  return (
    <div className="product-list">
      <div className="section-header">
        <h2>📦 Gestión de Productos</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBulkUploadModal(true)}
            title="Cargar productos desde archivo CSV/Excel"
          >
            📤 Carga Masiva
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="product-stats">
        <div className="stat-item">
          <span className="stat-value">{totalProducts}</span>
          <span className="stat-label">Total Productos</span>
        </div>
        <div className="stat-item">
          <span className="stat-value text-success">{inStockProducts}</span>
          <span className="stat-label">En Stock</span>
        </div>
        <div className="stat-item">
          <span className="stat-value text-danger">{outOfStockProducts}</span>
          <span className="stat-label">Sin Stock</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{categories.length}</span>
          <span className="stat-label">Categorías</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="search">🔍 Buscar producto:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por descripción..."
            className="form-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category-filter">📁 Filtrar por categoría:</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="form-select"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.idCategoria} value={category.idCategoria}>
                {category.nombreCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="stock-filter">📊 Filtrar por stock:</label>
          <select
            id="stock-filter"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'all' | 'in-stock' | 'out-of-stock')}
            className="form-select"
          >
            <option value="all">Todos los productos</option>
            <option value="in-stock">Solo en stock</option>
            <option value="out-of-stock">Solo sin stock</option>
          </select>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No hay productos</h3>
            <p>
              {filterCategory !== 'all' || searchTerm || stockFilter !== 'all' 
                ? 'No hay productos que coincidan con los filtros aplicados' 
                : 'Aún no has agregado productos a tu tienda'
              }
            </p>
            {filterCategory === 'all' && !searchTerm && stockFilter === 'all' && (
              <div className="empty-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  ➕ Crear primer producto
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowBulkUploadModal(true)}
                >
                  📤 Cargar desde Excel/CSV
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.idProducto}
              product={product}
              categories={categories}
              users={users}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingProduct(product)}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {/* Modal para carga masiva */}
      <Modal
        isOpen={showBulkUploadModal}
        title="📤 Carga Masiva de Productos"
        onClose={() => setShowBulkUploadModal(false)}
        size="large"
      >
        <BulkUploadProducts
          categories={categories}
          onBulkUpload={handleBulkUpload}
          onCancel={() => setShowBulkUploadModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal para crear producto */}
      <Modal
        isOpen={showCreateModal}
        title="Nuevo Producto"
        onClose={() => setShowCreateModal(false)}
        size="large"
      >
        <ProductForm
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal para editar producto */}
      <Modal
        isOpen={!!editingProduct}
        title="Editar Producto"
        onClose={() => setEditingProduct(null)}
        size="large"
      >
        <ProductForm
          initialData={editingProduct || undefined}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProduct(null)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!deletingProduct}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${deletingProduct?.descripcion}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProduct(null)}
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  );
};