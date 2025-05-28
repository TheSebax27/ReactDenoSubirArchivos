import React from 'react';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'categories', label: 'Categorías', icon: '📁' },
    { id: 'products', label: 'Productos', icon: '📦' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'cart', label: 'Carrito', icon: '🛒' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🏪 ADSO Tienda</h1>
        </div>
        
        <nav className="nav">
          <ul className="nav-list">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};