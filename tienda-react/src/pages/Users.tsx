import React from 'react';
import { UserList } from '../components/users/UserList';
import { useUsers } from '../hooks/useUsers';
import type { UserFormData } from '../types';

export const Users: React.FC = () => {
  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const handleCreateUser = async (data: UserFormData) => {
    await createUser(data);
  };

  const handleUpdateUser = async (id: number, data: UserFormData) => {
    await updateUser(id, data);
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
  };

  return (
    <div className="users-page">
      <UserList
        users={users}
        loading={loading}
        error={error}
        onCreateUser={handleCreateUser}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};