import React from 'react';

// Convert to default export
const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  ...props 
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      outline: 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300'
    };
    
    return `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className}`;
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Add default export
export default Button;