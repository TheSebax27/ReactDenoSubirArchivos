import React from 'react';
import { CartList } from '../components/cart/CartList';
import { useCart } from '../hooks/useCart';
import { useUsers } from '../hooks/useUsers';
import { useProducts } from '../hooks/useProducts';

export const Cart: React.FC = () => {
  const {
    cartItems,
    loading: cartLoading,
    error: cartError,
    removeFromCart,
    fetchCartItems
  } = useCart();

  const {
    users,
    loading: usersLoading
  } = useUsers();

  const {
    products,
    loading: productsLoading
  } = useProducts();

  const handleRemoveFromCart = async (id: number) => {
    await removeFromCart(id);
  };

  const handleRefreshCart = async () => {
    await fetchCartItems();
  };

  return (
    <div className="cart-page">
      <CartList
        cartItems={cartItems}
        users={users}
        products={products}
        loading={cartLoading || usersLoading || productsLoading}
        error={cartError}
        onRemoveFromCart={handleRemoveFromCart}
        onRefreshCart={handleRefreshCart}
      />
    </div>
  );
};