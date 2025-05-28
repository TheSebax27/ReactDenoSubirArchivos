import React from 'react';
import type { User } from '../../types';
import { apiService } from '../../services/api';

interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  const imageUrl = user.urlImagen ? apiService.getImageUrl(user.urlImagen) : '';

  return (
    <div className="user-card-modern">
      {/* Header con imagen y estado */}
      <div className="user-header-modern">
        <div className="user-avatar-container-modern">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${user.nombre} ${user.apellido}`}
              className="user-avatar-modern"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="60" fill="%23e2e8f0"/><text x="60" y="60" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="40" fill="%2364748b">👤</text></svg>`;
              }}
            />
          ) : (
            <div className="user-avatar-placeholder-modern">
              <span className="avatar-icon">👤</span>
            </div>
          )}
          <div className="user-status-indicator">
            <div className="status-dot active"></div>
          </div>
        </div>
        
        {/* Menú de opciones */}
        <div className="user-menu">
          <button className="menu-btn" title="Más opciones">⋯</button>
          <div className="menu-dropdown">
            <button onClick={onEdit} className="menu-item">
              <span className="menu-icon">✏️</span>
              Editar Perfil
            </button>
            <button onClick={onDelete} className="menu-item danger">
              <span className="menu-icon">🗑️</span>
              Eliminar Usuario
            </button>
          </div>
        </div>
      </div>
      
      {/* Información del usuario */}
      <div className="user-info-modern">
        <div className="user-name-section">
          <h3 className="user-name-modern">
            {user.nombre} {user.apellido}
          </h3>
          <div className="user-badges">
            <span className="badge badge-primary">Cliente</span>
            <span className="badge badge-success">Activo</span>
          </div>
        </div>
        
        <div className="user-details-modern">
          <div className="detail-item-modern">
            <div className="detail-icon-modern">📄</div>
            <div className="detail-content">
              <span className="detail-label">Documento</span>
              <span className="detail-value">{user.documento}</span>
            </div>
          </div>
          
          <div className="detail-item-modern">
            <div className="detail-icon-modern">📅</div>
            <div className="detail-content">
              <span className="detail-label">Estado</span>
              <span className="detail-value text-success">Verificado</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas del usuario */}
      <div className="user-stats-modern">
        <div className="stat-item-modern">
          <div className="stat-icon-modern">🛒</div>
          <div className="stat-info">
            <span className="stat-number">0</span>
            <span className="stat-label">Compras</span>
          </div>
        </div>
        <div className="stat-item-modern">
          <div className="stat-icon-modern">⭐</div>
          <div className="stat-info">
            <span className="stat-number">5.0</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="user-actions-modern">
        <button
          onClick={onEdit}
          className="btn-modern btn-edit-user"
          title="Editar usuario"
        >
          <span className="btn-icon">✏️</span>
          <span className="btn-text">Editar</span>
        </button>
        <button
          onClick={onDelete}
          className="btn-modern btn-delete-user"
          title="Eliminar usuario"
        >
          <span className="btn-icon">🗑️</span>
          <span className="btn-text">Eliminar</span>
        </button>
      </div>
      
      <div className="user-hover-overlay"></div>
    </div>
  );
};

export default UserCard;