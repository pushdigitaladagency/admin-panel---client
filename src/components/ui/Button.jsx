import React from 'react';

/**
 * Primary UI button with smooth hover animation.
 * Uses CSS custom properties defined in globals.css for theming.
 */
export const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }[variant] || 'btn-primary';

  return (
    <button type={type} className={`${baseClasses} ${variantClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};
