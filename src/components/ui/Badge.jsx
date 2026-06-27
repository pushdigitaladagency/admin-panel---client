import React from 'react';

export const Badge = ({ variant = 'info', className = '', children }) => {
  const baseClasses = 'badge';
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    purple: 'badge-purple',
    info: 'badge-info',
  }[variant] || 'badge-info';

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};
