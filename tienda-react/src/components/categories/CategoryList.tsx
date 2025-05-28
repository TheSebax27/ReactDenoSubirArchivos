import React, { useState } from 'react';
import type { Category, CategoryFormData } from '../../types';
import { Loading } from '../common/Loading';
import { ConfirmModal, Modal } from '../common/Modal';
import { CategoryForm } from './CategoryForm';
import { CategoryItem } from './CategoryItem';
import { BulkUploadCategories } from './BulkUploadCategories';

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  onCreateCategory: (data: CategoryFormData) => Promise<void>;
  onUpdateCategory: (id: number, data: CategoryFormData) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading,
  error,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreate = async (data: CategoryFormData) => {
    setActionLoading(true);
    try {
      await onCreateCategory(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error al crear categoría:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUpload = async (categoriesData: CategoryFormData[]) => {
    setActionLoading(true);
    try {
      console.log('🚀 Iniciando carga masiva de categorías:', categoriesData.length);
      
      // Crear categorías una por una
      for (const categoryData of categoriesData) {
        console.log('📁 Creando categoría:', categoryData.nombreCategoria);
        await onCreateCategory(categoryData);
      }
      
      setShowBulkUploadModal(false);
      alert(`¡${categoriesData.length} categorías cargadas exitosamente!`);
      console.log('✅ Carga masiva completada');
    } catch (error) {
      console.error('💥 Error en carga masiva:', error);
      alert('Error al cargar categorías: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    setActionLoading(true);
    try {
      await onUpdateCategory(editingCategory.idCategoria, data);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    
    setActionLoading(true);
    try {
      await onDeleteCategory(deletingCategory.idCategoria);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando categorías..." />;
  }

  return (
    <div className="category-list">
      <div className="section-header">
        <h2>📁 Gestión de Categorías</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowBulkUploadModal(true)}
            title="Subir archivo CSV/Excel con múltiples categorías"
          >
            📤 Carga Masiva CSV
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            ➕ Nueva Categoría
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Estadísticas */}
      <div className="category-stats">
        <div className="stat-item">
          <span className="stat-value">{categories.length}</span>
          <span className="stat-label">Total Categorías</span>
        </div>
      </div>

      <div className="categories-grid">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No hay categorías registradas</h3>
            <p>Comienza creando tu primera categoría o carga múltiples desde un archivo CSV</p>
            <div className="empty-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                ➕ Crear primera categoría
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowBulkUploadModal(true)}
              >
                📤 Cargar desde CSV/Excel
              </button>
            </div>
          </div>
        ) : (
          categories.map(category => (
            <CategoryItem
              key={category.idCategoria}
              category={category}
              onEdit={() => setEditingCategory(category)}
              onDelete={() => setDeletingCategory(category)}
            />
          ))
        )}
      </div>

      {/* Modal para crear categoría */}
      <Modal
        isOpen={showCreateModal}
        title="Nueva Categoría"
        onClose={() => setShowCreateModal(false)}
      >
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal para carga masiva */}
      <Modal
        isOpen={showBulkUploadModal}
        title="📤 Carga Masiva de Categorías desde CSV/Excel"
        onClose={() => setShowBulkUploadModal(false)}
        size="large"
      >
        <BulkUploadCategories
          onBulkUpload={handleBulkUpload}
          onCancel={() => setShowBulkUploadModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal para editar categoría */}
      <Modal
        isOpen={!!editingCategory}
        title="Editar Categoría"
        onClose={() => setEditingCategory(null)}
      >
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCategory(null)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!deletingCategory}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deletingCategory?.nombreCategoria}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  );
};