import { useState, useEffect, useCallback } from 'react';
import type { CartItem, CartFormData } from '../types';
import { cartService } from '../services/cartService';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await cartService.getAll();
      setCartItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar carrito');
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (cartData: CartFormData) => {
    const newItem = await cartService.create(cartData);
    setCartItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  const updateCartItem = useCallback(async (id: number, cartData: CartFormData) => {
    const updatedItem = await cartService.update(id, cartData);
    setCartItems(prev =>
      prev.map(item => item.idCompra === id ? updatedItem : item)
    );
    return updatedItem;
  }, []);

  const removeFromCart = useCallback(async (id: number) => {
    await cartService.delete(id);
    setCartItems(prev => prev.filter(item => item.idCompra !== id));
  }, []);

  const getCartItemsByUser = useCallback((userId: number) => {
    return cartItems.filter(item => item.idUsuario === userId);
  }, [cartItems]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return {
    cartItems,
    loading,
    error,
    fetchCartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartItemsByUser
  };
}
