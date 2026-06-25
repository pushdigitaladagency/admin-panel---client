'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';

export function RoleForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  // Fetch all permissions from backend
  const { data: permissionsData } = useApi('/permissions');
  const AVAILABLE_PERMISSIONS = (permissionsData || []).map((p) => ({
    id: p.id,
    name: p.code || p.name,
    label: `${p.code || p.name} - ${p.description || p.name}`,
  }));

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
          status: initialData?.status === false || initialData?.status === 'inactive' ? 'inactive' : 'active',
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
        const slug = trimmed
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        setValue('code', slug, { shouldDirty: true, shouldValidate: true });
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
      const payload = {
        name: data.name,
        code: data.code,
        description: data.description,
        status: data.status === 'active' || data.status === true,
      };

      if (isEdit) {
        await api.put(`/roles/${initialData.id}`, payload);
        // Save permission assignments
        await api.put(`/roles/${initialData.id}/permissions`, {
          permissionIds: data.permissions,
        });
        addToast('Role updated successfully', 'success');
      } else {
        const res = await api.post('/roles', payload);
        // Save permission assignments for the new role
        if (res.data?.id && data.permissions.length > 0) {
          await api.put(`/roles/${res.data.id}/permissions`, {
            permissionIds: data.permissions,
          });
        }
        addToast('Role created successfully', 'success');
      }
      router.push('/roles');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  return (
    <div className="card max-w-2xl" style={{ overflow: 'visible' }}>
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
              <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
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
                      border: '1px solid var(--color-border)',
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
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{ width: 'auto', minWidth: '72px', padding: '9px 18px' }}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/roles')}
              style={{ width: 'auto', minWidth: '84px', padding: '9px 18px' }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
