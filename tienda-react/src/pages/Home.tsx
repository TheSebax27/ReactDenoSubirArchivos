import React from 'react';

interface HomeProps {
  onNavigate: (section: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'categories',
      title: 'Gestión de Categorías',
      description: 'Organiza y administra las categorías de productos de tu tienda de manera eficiente',
      icon: '📁',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 'products',
      title: 'Gestión de Productos', 
      description: 'Controla tu inventario completo con imágenes, precios y stock en tiempo real',
      icon: '📦',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administra clientes y usuarios del sistema con perfiles completos',
      icon: '👥',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 'cart',
      title: 'Carrito de Compras',
      description: 'Visualiza y gestiona las compras y pedidos de tus clientes',
      icon: '🛒',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { label: 'Módulos Integrados', value: '4', icon: '⚡', color: 'blue' },
    { label: 'CRUD Completo', value: '✓', icon: '✅', color: 'green' },
    { label: 'Subida de Archivos', value: '✓', icon: '📤', color: 'purple' },
    { label: 'API REST', value: '✓', icon: '🔗', color: 'orange' }
  ];

  const developers = [
    {
      name: 'Sebastián',
      role: 'Full Stack Developer',
      image: '/images/sebas.jpg',
      skills: ['React', 'TypeScript', 'Node.js', 'MySQL'],
      github: '#',
      linkedin: '#',
      description: 'Especialista en frontend y experiencia de usuario'
    },
    {
      name: 'Santiago',
      role: 'Backend Developer',
      image: '/images/santi.jpg',
      skills: ['Deno', 'Oak', 'MySQL', 'REST APIs'],
      github: '#',
      linkedin: '#',
      description: 'Experto en arquitectura de backend y bases de datos'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            🚀 Sistema de Gestión Completo
          </div>
          <h1 className="hero-title">
            <span className="gradient-text">ADSO Tienda</span>
          </h1>
          
         
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-hero"
              onClick={() => onNavigate('products')}
            >
              🚀 Comenzar Ahora
            </button>
            <button 
              className="btn btn-secondary btn-hero"
              onClick={() => onNavigate('categories')}
            >
              📖 Ver Funciones
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card">
            <div className="card-icon">🏪</div>
            <div className="card-title">Tu Tienda Digital</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="section-header-center">
          <h2>🎯 Características Destacadas</h2>
          <p>Todo lo que necesitas para gestionar tu negocio</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div className="stat-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header-center">
          <h2>🛠️ Módulos del Sistema</h2>
          <p>Explora cada funcionalidad disponible</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`feature-card feature-${feature.color}`}
              onClick={() => onNavigate(feature.id)}
            >
              <div className="feature-header">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-badge">Disponible</div>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              <div className="feature-footer">
                <button className="feature-button">
                  Explorar <span className="arrow">→</span>
                </button>
              </div>
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Developers Section */}
      <div className="developers-section">
        <div className="section-header-center">
          <h2>👨‍💻 Desarrolladores</h2>
          <p>Conoce al talentoso equipo detrás de este proyecto</p>
        </div>
        <div className="developers-grid">
          {developers.map((dev, index) => (
            <div key={index} className="developer-card">
              <div className="developer-image-container">
                <img 
                  src={dev.image} 
                  alt={dev.name}
                  className="developer-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23e2e8f0"/><text x="100" y="100" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="60" fill="%2364748b">👨‍💻</text></svg>`;
                  }}
                />
                <div className="developer-status">
                  <div className="status-dot"></div>
                  <span>Activo</span>
                </div>
              </div>
              <div className="developer-info">
                <h3 className="developer-name">{dev.name}</h3>
                <p className="developer-role">{dev.role}</p>
                <p className="developer-description">{dev.description}</p>
                
                <div className="developer-skills">
                  <span className="skills-label">Tecnologías:</span>
                  <div className="skills-list">
                    {dev.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="developer-links">
                  <a href={dev.github} className="social-link github">
                    <span className="social-icon">🐙</span>
                    GitHub
                  </a>
                  <a href={dev.linkedin} className="social-link linkedin">
                    <span className="social-icon">💼</span>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Section */}
      <div className="tech-section">
        <div className="section-header-center">
          <h2>⚡ Stack Tecnológico</h2>
          <p>Construido con las mejores herramientas del mercado</p>
        </div>
        <div className="tech-grid">
          <div className="tech-category frontend">
            <div className="tech-icon">🎨</div>
            <h3>Frontend</h3>
            <ul>
              <li><span className="tech-emoji">⚛️</span> React 19</li>
              <li><span className="tech-emoji">📘</span> TypeScript</li>
              <li><span className="tech-emoji">🎨</span> CSS3 Moderno</li>
              <li><span className="tech-emoji">⚡</span> Vite</li>
            </ul>
          </div>
          <div className="tech-category backend">
            <div className="tech-icon">🔧</div>
            <h3>Backend</h3>
            <ul>
              <li><span className="tech-emoji">🦕</span> Deno</li>
              <li><span className="tech-emoji">🌳</span> Oak Framework</li>
              <li><span className="tech-emoji">🗄️</span> MySQL</li>
              <li><span className="tech-emoji">📡</span> REST API</li>
            </ul>
          </div>
          <div className="tech-category features">
            <div className="tech-icon">✨</div>
            <h3>Características</h3>
            <ul>
              <li><span className="tech-emoji">📱</span> Diseño Responsivo</li>
              <li><span className="tech-emoji">🖼️</span> Subida de Archivos</li>
              <li><span className="tech-emoji">🔍</span> Búsqueda Avanzada</li>
              <li><span className="tech-emoji">✅</span> Validación Completa</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <div className="cta-icon">🚀</div>
          <h2>¿Listo para comenzar?</h2>
          <p>Explora todas las funcionalidades y administra tu tienda de forma profesional</p>
          <div className="cta-buttons">
            <button 
              className="btn btn-primary btn-large cta-primary"
              onClick={() => onNavigate('products')}
            >
              <span className="btn-icon">📦</span>
              Gestionar Productos
            </button>
            <button 
              className="btn btn-secondary btn-large cta-secondary"
              onClick={() => onNavigate('categories')}
            >
              <span className="btn-icon">📁</span>
              Ver Categorías
            </button>
          </div>
        </div>
        <div className="cta-background">
          <div className="cta-shape cta-shape-1"></div>
          <div className="cta-shape cta-shape-2"></div>
          <div className="cta-shape cta-shape-3"></div>
        </div>
      </div>
    </div>
  );
};