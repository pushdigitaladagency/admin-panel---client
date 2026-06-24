import React, { forwardRef } from 'react';

export const Checkbox = forwardRef(({ className = '', ...rest }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`form-checkbox ${className}`}
      {...rest}
    />
  );
});

Checkbox.displayName = 'Checkbox';
