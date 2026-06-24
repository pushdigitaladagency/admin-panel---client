import React, { forwardRef } from 'react';

export const Select = forwardRef(({ className = '', children, ...rest }, ref) => {
  return (
    <select
      ref={ref}
      className={`form-select ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';
