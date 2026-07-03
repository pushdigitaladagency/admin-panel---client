'use client';

import React from 'react';
import { useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/Input';

// SEO/text field with a live character counter. The `limit` is the DB model column
// length (e.g. STRING(255) -> 255): it is shown for reference AND hard-enforced via
// maxLength. TEXT-backed columns (keywords/descriptions) have no fixed length, so
// pass no `limit` — they get a plain character count with no cap.
//
// Uses useWatch so only the counter re-renders on keystroke, not the whole form.
export function CountedField({
  control,
  register,
  errors,
  name,
  label,
  limit,
  required = false,
  multiline = false,
  rows = 3,
  placeholder,
  rules,
}) {
  const value = useWatch({ control, name }) ?? '';
  const len = String(value).length;
  const atCap = !!limit && len >= limit;

  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {label}{required && ' *'}
        </label>
        <span
          style={{ fontSize: '0.72rem', fontVariantNumeric: 'tabular-nums', color: atCap ? 'var(--color-danger)' : 'var(--color-text-muted)' }}
          title={limit ? `Database limit: ${limit} characters` : 'No fixed length (TEXT column)'}
        >
          {limit ? `${len} / ${limit}` : `${len} chars`}
        </span>
      </div>

      {multiline ? (
        <textarea
          className={`form-textarea ${errors?.[name] ? 'error' : ''}`}
          rows={rows}
          maxLength={limit || undefined}
          placeholder={placeholder}
          {...register(name, rules)}
        />
      ) : (
        <Input
          maxLength={limit || undefined}
          placeholder={placeholder}
          className={errors?.[name] ? 'error' : ''}
          {...register(name, rules)}
        />
      )}

      {errors?.[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );
}
