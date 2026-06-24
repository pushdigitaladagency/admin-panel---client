'use client';

import React from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export function RoleForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const AVAILABLE_PERMISSIONS = [
    { id: 1, name: 'post.view', label: 'post.view - Can view posts' },
    { id: 2, name: 'post.create', label: 'post.create - Can create posts' },
    { id: 3, name: 'post.edit', label: 'post.edit - Can edit posts' },
    { id: 4, name: 'post.delete', label: 'post.delete - Can delete posts' },
    { id: 5, name: 'user.view', label: 'user.view - Can view users' },
    { id: 6, name: 'user.create', label: 'user.create - Can create users' },
    { id: 7, name: 'user.edit', label: 'user.edit - Can edit users' },
    { id: 8, name: 'user.delete', label: 'user.delete - Can delete users' },
    { id: 9, name: 'role.view', label: 'role.view - Can view roles' },
    { id: 10, name: 'settings.edit', label: 'settings.edit - Can modify settings' },
  ];

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
          name: initialData?.name || '',
          code: initialData?.code || '',
          description: initialData?.description || '',
          status: initialData?.status || 'active',
          permissions: initialData?.permissions ?? [],
        }
      : { name: '', code: '', description: '', status: 'active', permissions: [] },
  });

  const selectedPermissions = watch('permissions') || [];
  const roleName = watch('name');

  React.useEffect(() => {
    if (roleName !== undefined) {
      const trimmed = roleName.trim();
      if (trimmed) {
        let hash = 0;
        for (let i = 0; i < trimmed.length; i++) {
          hash = (hash << 5) - hash + trimmed.charCodeAt(i);
          hash = hash & hash;
        }
        const numericCode = (Math.abs(hash) % 90000) + 10000;
        setValue('code', numericCode.toString(), { shouldDirty: true, shouldValidate: true });
      } else {
        setValue('code', '', { shouldDirty: true, shouldValidate: true });
      }
    }
  }, [roleName, setValue]);

  React.useEffect(() => {
    register('permissions');
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
        addToast('Role updated successfully (mock)', 'success');
      } else {
        addToast('Role created successfully (mock)', 'success');
      }
      router.push('/roles');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  return (
    <div className="card max-w-2xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? 'Edit Role' : 'Create Role'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Role Name <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <Input
                {...register('name', { required: 'Role Name is required' })}
                placeholder="Superadmin"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Role Code</label>
              <Input
                {...register('code')}
                placeholder="Auto-generated from name..."
                readOnly
                className="cursor-not-allowed opacity-70"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              className="form-textarea"
              placeholder="Description of the role's responsibilities..."
              style={{ minHeight: '60px' }}
            />
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
              <label className="form-label">Permissions</label>
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
                    {selectedPermissions.length === 0
                      ? 'Select permissions...'
                      : `${selectedPermissions.length} permissions selected`}
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
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                      const isChecked = selectedPermissions.includes(perm.id);
                      return (
                        <label
                          key={perm.id}
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
                                ? selectedPermissions.filter((id) => id !== perm.id)
                                : [...selectedPermissions, perm.id];
                              setValue('permissions', newSelection, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          />
                          <span style={{ color: 'var(--color-text)' }}>{perm.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              {errors.permissions && (
                <p className="form-error">{errors.permissions.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/roles')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Role'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
