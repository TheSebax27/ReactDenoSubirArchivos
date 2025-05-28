import React from 'react';
import type { Category } from '../../types';

interface CategoryItemProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete
}) => {
  return (
    <div className="category-item-modern">
      <div className="category-header">
        <div className="category-icon-modern">
          <span className="icon">📁</span>
          <div className="icon-bg"></div>
        </div>
        <div className="category-menu">
          <button className="menu-btn" title="Más opciones">⋯</button>
          <div className="menu-dropdown">
            <button onClick={onEdit} className="menu-item">
              <span className="menu-icon">✏️</span>
              Editar
            </button>
            <button onClick={onDelete} className="menu-item danger">
              <span className="menu-icon">🗑️</span>
              Eliminar
            </button>
          </div>
        </div>
      </div>
      
      <div className="category-content-modern">
        <h3 className="category-name-modern">{category.nombreCategoria}</h3>
        <div className="category-stats">
          <div className="stat-badge">
            <span className="stat-icon">📊</span>
            <span className="stat-text">Activa</span>
          </div>
        </div>
      </div>
      
      <div className="category-actions-modern">
        <button
          onClick={onEdit}
          className="btn-modern btn-edit"
          title="Editar categoría"
        >
          <span className="btn-icon">✏️</span>
          <span className="btn-text">Editar</span>
        </button>
        <button
          onClick={onDelete}
          className="btn-modern btn-delete"
          title="Eliminar categoría"
        >
          <span className="btn-icon">🗑️</span>
          <span className="btn-text">Eliminar</span>
        </button>
      </div>
      
      <div className="category-overlay"></div>
    </div>
  );
};

export default CategoryItem;