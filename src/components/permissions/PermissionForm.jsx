'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export function PermissionForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

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
          module: initialData?.group || 'Post',
          name: initialData?.name || '',
          code: initialData?.code || '',
          description: initialData?.description || '',
        }
      : { module: 'Post', name: '', code: '', description: '' },
  });

  const moduleName = watch('module');
  const permissionName = watch('name');

  // Auto-generate code e.g. "post.create-posts"
  React.useEffect(() => {
    if (permissionName !== undefined && moduleName !== undefined) {
      const slug = permissionName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const mod = moduleName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      
      const generatedCode = mod && slug ? `${mod}.${slug}` : slug || mod;
      setValue('code', generatedCode, { shouldDirty: true, shouldValidate: true });
    }
  }, [moduleName, permissionName, setValue]);

  const onSubmit = async (data) => {
    try {
      // Mock network delay
      await new Promise(res => setTimeout(res, 500));
      
      if (isEdit) {
        addToast('Permission updated successfully (mock)', 'success');
      } else {
        addToast('Permission created successfully (mock)', 'success');
      }
      router.push('/permissions');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const MODULES = [
    'Post',
    'User',
    'Role',
    'Settings',
    'Media',
    'Term',
    'Action Log',
  ];

  return (
    <div className="card max-w-2xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? 'Edit Permission' : 'Create Permission'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Module Name <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select 
                {...register('module', { required: 'Module Name is required' })} 
                className={`form-select ${errors.module ? 'error' : ''}`}
              >
                {MODULES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {errors.module && (
                <p className="form-error">{errors.module.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Permission Name <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <Input
                {...register('name', { required: 'Permission Name is required' })}
                placeholder="Can view dashboard"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <p className="form-error">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Permission Code <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <Input
              {...register('code', { required: 'Permission Code is required' })}
              placeholder="Auto-generated (e.g. post.view)"
              readOnly
              className="cursor-not-allowed opacity-70"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
            />
            {errors.code && (
              <p className="form-error">{errors.code.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              className="form-textarea"
              placeholder="Describe what access this permission provides..."
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/permissions')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Permission'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
