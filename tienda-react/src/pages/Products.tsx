import React from 'react';
import { ProductList } from '../components/products/ProductList';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useUsers } from '../hooks/useUsers';
import type { ProductFormData } from '../types';

export const Products: React.FC = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct
  } = useProducts();

  const {
    categories,
    loading: categoriesLoading
  } = useCategories();

  const {
    users,
    loading: usersLoading
  } = useUsers();

  const handleCreateProduct = async (data: ProductFormData) => {
    await createProduct(data);
  };

  const handleUpdateProduct = async (id: number, data: ProductFormData) => {
    await updateProduct(id, data);
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
  };

  return (
    <div className="products-page">
      <ProductList
        products={products}
        categories={categories}
        users={users}
        loading={productsLoading || categoriesLoading || usersLoading}
        error={productsError}
        onCreateProduct={handleCreateProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};