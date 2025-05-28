import { useState, useEffect, useCallback } from 'react';
import type { Category, CategoryFormData } from '../types';
import { categoryService } from '../services/categoryService';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData: CategoryFormData) => {
    const newCategory = await categoryService.create(categoryData);
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback(async (id: number, categoryData: CategoryFormData) => {
    const updatedCategory = await categoryService.update(id, categoryData);
    setCategories(prev => 
      prev.map(cat => cat.idCategoria === id ? updatedCategory : cat)
    );
    return updatedCategory;
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await categoryService.delete(id);
    setCategories(prev => prev.filter(cat => cat.idCategoria !== id));
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}
