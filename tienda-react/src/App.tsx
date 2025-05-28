import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { Products } from './pages/Products';
import { Users } from './pages/Users';
import { Cart } from './pages/Cart';

// Importar estilos CSS
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home onNavigate={handleSectionChange} />;
      case 'categories':
        return <Categories />;
      case 'products':
        return <Products />;
      case 'users':
        return <Users />;
      case 'cart':
        return <Cart />;
      default:
        return <Home onNavigate={handleSectionChange} />;
    }
  };

  return (
    <div className="app">
      <Header 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <main className="main-content">
        {renderCurrentSection()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;