import React, { forwardRef, useState } from 'react';
import { Calendar, Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({ className = '', type, onChange, value, defaultValue, ...rest }, ref) => {
  const [internalVal, setInternalVal] = useState(value || defaultValue || '');
  const [showPassword, setShowPassword] = useState(false);
  const dateInputRef = React.useRef(null);

  const setRefs = React.useCallback((node) => {
    dateInputRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalVal(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (type !== 'date' || value !== undefined) return;

    const syncDateValue = () => {
      const currentValue = dateInputRef.current?.value || defaultValue || '';
      setInternalVal(currentValue);
    };

    syncDateValue();
    const frame = window.requestAnimationFrame(syncDateValue);

    return () => window.cancelAnimationFrame(frame);
  }, [type, value, defaultValue]);

  const handleTextClick = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch {
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
          ref={setRefs}
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

  if (type === 'password') {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`form-input ${className}`}
          onChange={onChange}
          value={value}
          defaultValue={defaultValue}
          {...rest}
          style={{ ...rest.style, paddingRight: '40px' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-muted)'
          }}
          tabIndex="-1"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
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
