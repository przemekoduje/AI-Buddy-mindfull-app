// src/components/CustomButton.js
import React from 'react';
import './CustomButton.scss'; // Stworzymy ten plik stylów zaraz

const CustomButton = ({ onClick, children, disabled, className }) => {
  return (
    <button 
      className={`custom-button ${className || ''}`} // Dodaje klasę 'custom-button' i ewentualne dodatkowe
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;
