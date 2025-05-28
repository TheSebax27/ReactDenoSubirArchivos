import { useState, useEffect, useCallback } from 'react';
import type { User, UserFormData } from '../types';
import { userService } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: UserFormData) => {
    const newUser = await userService.create(userData);
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback(async (id: number, userData: UserFormData) => {
    const updatedUser = await userService.update(id, userData);
    setUsers(prev => 
      prev.map(user => user.idUsuario === id ? updatedUser : user)
    );
    return updatedUser;
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    await userService.delete(id);
    setUsers(prev => prev.filter(user => user.idUsuario !== id));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
}
