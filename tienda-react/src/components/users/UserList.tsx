import React, { useState, useMemo } from 'react';
import type  { User, UserFormData } from '../../types';
import { Loading } from '../common/Loading';
import { ConfirmModal, Modal } from '../common/Modal';
import { UserForm } from './UserForm';
import { UserCard } from './UserCard';

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onCreateUser: (data: UserFormData) => Promise<void>;
  onUpdateUser: (id: number, data: UserFormData) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  error,
  onCreateUser,
  onUpdateUser,
  onDeleteUser
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    return users.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.documento.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleCreate = async (data: UserFormData) => {
    setActionLoading(true);
    try {
      await onCreateUser(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (data: UserFormData) => {
    if (!editingUser) return;
    
    setActionLoading(true);
    try {
      await onUpdateUser(editingUser.idUsuario, data);
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    
    setActionLoading(true);
    try {
      await onDeleteUser(deletingUser.idUsuario);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando usuarios..." />;
  }

  return (
    <div className="user-list">
      <div className="section-header">
        <h2>👥 Gestión de Usuarios</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Filtro de búsqueda */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="search-users">🔍 Buscar usuario:</label>
          <input
            type="text"
            id="search-users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o documento..."
            className="form-input"
          />
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="users-grid">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <p>👥 No hay usuarios {searchTerm ? 'que coincidan con la búsqueda' : 'registrados'}</p>
            {!searchTerm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                Crear primer usuario
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map(user => (
            <UserCard
              key={user.idUsuario}
              user={user}
              onEdit={() => setEditingUser(user)}
              onDelete={() => setDeletingUser(user)}
            />
          ))
        )}
      </div>

      {/* Modal para crear usuario */}
      <Modal
        isOpen={showCreateModal}
        title="Nuevo Usuario"
        onClose={() => setShowCreateModal(false)}
        size="large"
      >
        <UserForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal para editar usuario */}
      <Modal
        isOpen={!!editingUser}
        title="Editar Usuario"
        onClose={() => setEditingUser(null)}
        size="large"
      >
        <UserForm
          initialData={editingUser || undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditingUser(null)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!deletingUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${deletingUser?.nombre} ${deletingUser?.apellido}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingUser(null)}
        confirmText="Eliminar"
        danger={true}
      />
    </div>
  );
};