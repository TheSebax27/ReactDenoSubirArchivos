import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFormData } from '../types';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: ProductFormData) => {
    const newProduct = await productService.create(productData);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id: number, productData: ProductFormData) => {
    const updatedProduct = await productService.update(id, productData);
    setProducts(prev => 
      prev.map(prod => prod.idProducto === id ? updatedProduct : prod)
    );
    return updatedProduct;
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    await productService.delete(id);
    setProducts(prev => prev.filter(prod => prod.idProducto !== id));
  }, []);

  const getProductsByCategory = useCallback((categoryId: number) => {
    return products.filter(product => product.idCategoria === categoryId);
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
  };
}
