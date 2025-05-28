import React from 'react';
import { CategoryList } from '../components/categories/CategoryList';
import { useCategories } from '../hooks/useCategories';
import type { CategoryFormData } from '../types';

export const Categories: React.FC = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory
  } = useCategories();

  const handleCreateCategory = async (data: CategoryFormData) => {
    await createCategory(data);
  };

  const handleUpdateCategory = async (id: number, data: CategoryFormData) => {
    await updateCategory(id, data);
  };

  const handleDeleteCategory = async (id: number) => {
    await deleteCategory(id);
  };

  return (
    <div className="categories-page">
      <CategoryList
        categories={categories}
        loading={loading}
        error={error}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};