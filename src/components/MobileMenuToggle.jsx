import React from 'react';

const MobileMenuToggle = ({ isOpen, onToggle, className = '' }) => {
  return (
    <button
      type="button"
      className={`mobile-menu-toggle btn btn-outline-primary d-lg-none ${className}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={isOpen}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1060,
        width: '3rem',
        height: '3rem',
        padding: 0,
        border: '2px solid #435ebe',
        borderRadius: '0.375rem',
        backgroundColor: 'white',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="hamburger-icon"
        style={{
          width: '1.5rem',
          height: '1.2rem',
          position: 'relative',
          transform: isOpen ? 'rotate(45deg)' : 'none',
          transition: 'transform 0.3s ease'
        }}
      >
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            backgroundColor: '#435ebe',
            borderRadius: '1px',
            opacity: isOpen ? 0 : 1,
            left: 0,
            top: '0.25rem',
            transition: 'all 0.3s ease'
          }}
        />
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            backgroundColor: '#435ebe',
            borderRadius: '1px',
            left: 0,
            top: '0.5rem',
            transform: isOpen ? 'rotate(90deg)' : 'none',
            transition: 'all 0.3s ease'
          }}
        />
        <span
          style={{
            display: 'block',
            position: 'absolute',
            height: '2px',
            width: '100%',
            backgroundColor: '#435ebe',
            borderRadius: '1px',
            opacity: isOpen ? 0 : 1,
            left: 0,
            top: '0.75rem',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
    </button>
  );
};

export default MobileMenuToggle;
