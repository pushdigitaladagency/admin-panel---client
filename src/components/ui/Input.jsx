import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';

export const Input = forwardRef(({ className = '', type, onChange, value, defaultValue, ...rest }, ref) => {
  const [internalVal, setInternalVal] = React.useState(value || defaultValue || '');
  const fallbackRef = React.useRef(null);
  const activeRef = ref || fallbackRef;

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalVal(value);
    }
  }, [value]);

  const handleTextClick = () => {
    if (activeRef.current) {
      try {
        activeRef.current.showPicker();
      } catch (err) {
        // Fallback for unsupported browsers
      }
    }
  };

  if (type === 'date') {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          className={`form-input ${className}`}
          value={internalVal}
          readOnly
          placeholder={rest.placeholder || 'Select date'}
          onClick={handleTextClick}
          style={{ paddingRight: '40px', cursor: 'pointer' }}
        />
        <div 
          style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-muted)'
          }}
        >
          <Calendar size={18} />
        </div>
        <input
          ref={activeRef}
          type="date"
          onChange={(e) => {
            setInternalVal(e.target.value);
            if (onChange) onChange(e);
          }}
          value={value}
          defaultValue={defaultValue}
          {...rest}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '24px',
            height: '24px',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 10
          }}
        />
      </div>
    );
  }

  return (
    <input
      ref={ref}
      type={type}
      className={`form-input ${className}`}
      onChange={onChange}
      value={value}
      defaultValue={defaultValue}
      {...rest}
    />
  );
});

Input.displayName = 'Input';
