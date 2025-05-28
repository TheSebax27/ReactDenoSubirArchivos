import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🏪 ADSO Tienda</h3>
            <p>Sistema de gestión de tienda desarrollado con React y Deno</p>
          </div>
          
          <div className="footer-section">
            <h4>Funcionalidades</h4>
            <ul>
              <li>Gestión de Categorías</li>
              <li>Gestión de Productos</li>
              <li>Gestión de Usuarios</li>
              <li>Carrito de Compras</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Tecnologías</h4>
            <ul>
              <li>React + TypeScript</li>
              <li>Deno + Oak</li>
              <li>MySQL</li>
              <li>CSS3</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 ADSO Tienda. Desarrollado para aprendizaje.</p>
        </div>
      </div>
    </footer>
  );
};