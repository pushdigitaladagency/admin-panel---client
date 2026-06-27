import React from 'react';

/**
 * Primary UI button with smooth hover animation.
 * Uses CSS custom properties defined in globals.css for theming.
 */
export const Button = ({
  variant = 'primary',
  className = '',
  type = 'button',
  loading = false,
  loadingText,
  disabled = false,
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

  const loadingClass = loading ? 'btn-loading' : '';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${loadingClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      {loading ? (loadingText ?? children) : children}
    </button>
  );
};
