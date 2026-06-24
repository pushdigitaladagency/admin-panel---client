import React, { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...rest }, ref) => {
  return (
    <input
      ref={ref}
      className={`form-input ${className}`}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
