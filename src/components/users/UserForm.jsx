'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export function UserForm({ initialData, availableRoles = [] }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEdit
      ? {
          id: initialData?.id,
          first_name: initialData?.first_name || '',
          last_name: initialData?.last_name || '',
          email: initialData?.email || '',
          username: initialData?.username || '',
          phone: initialData?.phone || '',
          profile_img: initialData?.profile_img || '',
          status: initialData?.status || 'active',
          notes: initialData?.notes || '',
          roles: initialData?.roles ?? [],
        }
      : { first_name: '', last_name: '', email: '', username: '', password: '', password_confirmation: '', phone: '', profile_img: '', status: 'active', notes: '', roles: [] },
  });

  const selectedRoles = watch('roles') || [];

  React.useEffect(() => {
    register('roles');
  }, [register]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    try {
      // Mock network delay
      await new Promise(res => setTimeout(res, 500));

      if (isEdit) {
        addToast('User updated successfully (mock)', 'success');
      } else {
        addToast('User created successfully (mock)', 'success');
      }
      router.push('/users');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  return (
    <div className="card max-w-3xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? 'Edit User' : 'Create User'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <Input
                {...register('first_name')}
                placeholder="John"
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <p className="form-error">{errors.first_name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <Input
                {...register('last_name')}
                placeholder="Doe"
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && (
                <p className="form-error">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Email</label>
              <Input
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Username (optional)</label>
              <Input
                {...register('username')}
                placeholder="johndoe"
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <p className="form-error">{errors.username.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Password {isEdit && '(leave blank to keep)'}</label>
              <Input
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <Input
                type="password"
                {...register('password_confirmation')}
                placeholder="••••••••"
                className={errors.password_confirmation ? 'error' : ''}
              />
              {errors.password_confirmation && (
                <p className="form-error">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <Input
                type="tel"
                {...register('phone')}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Image</label>
              <Input
                type="file"
                accept="image/*"
                {...register('profile_img')}
                className="form-input"
                style={{ padding: '7px 14px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select {...register('status')} className="form-select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                {...register('notes')}
                className="form-textarea"
                placeholder="Internal notes about this user..."
                style={{ minHeight: '44px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Roles</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="form-select text-left w-full flex items-center justify-between cursor-pointer"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="truncate">
                  {selectedRoles.length === 0
                    ? 'Select roles...'
                    : selectedRoles.map(rid => availableRoles.find(r => r.id === rid)?.name || `Role #${rid}`).join(', ')}
                </span>
                <span className="ml-2 text-gray-500 font-semibold" style={{ fontSize: '10px' }}>▼</span>
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto p-2"
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    position: 'absolute',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {availableRoles.map((role) => {
                    const isChecked = selectedRoles.includes(role.id);
                    return (
                      <label
                        key={role.id}
                        className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                        style={{
                          transition: 'background-color var(--transition-fast)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-glow)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          checked={isChecked}
                          onChange={() => {
                            const newSelection = isChecked
                              ? selectedRoles.filter((id) => id !== role.id)
                              : [...selectedRoles, role.id];
                            setValue('roles', newSelection, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                        <span style={{ color: 'var(--color-text)' }}>{role.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            {errors.roles && (
              <p className="form-error">{errors.roles.message}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/users')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
