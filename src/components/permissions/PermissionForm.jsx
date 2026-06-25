'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useApi } from '@/lib/useApi';

export function PermissionForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  // Fetch modules from backend
  const { data: modulesData } = useApi('/modules');
  const MODULES = (modulesData || []).map((m) => ({ id: m.id, name: m.name }));

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
          module_id: initialData?.module_id || initialData?.module?.id || '',
          name: initialData?.name || '',
          code: initialData?.code || '',
          action: initialData?.action || '',
          description: initialData?.description || '',
        }
      : { module_id: '', name: '', code: '', action: '', description: '' },
  });

  const moduleName = watch('module_id');
  const permissionName = watch('name');

  // Auto-generate code
  React.useEffect(() => {
    if (permissionName !== undefined && moduleName !== undefined) {
      const mod = MODULES.find((m) => String(m.id) === String(moduleName));
      const modSlug = mod
        ? mod.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')
        : '';
      const nameSlug = permissionName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

      const generatedCode = modSlug && nameSlug ? `${modSlug}.${nameSlug}` : nameSlug || modSlug;
      setValue('code', generatedCode, { shouldDirty: true, shouldValidate: true });
    }
  }, [moduleName, permissionName, setValue, MODULES]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        module_id: Number(data.module_id),
        name: data.name,
        code: data.code,
        action: data.action,
        description: data.description,
      };

      if (isEdit) {
        await api.put(`/permissions/${initialData.id}`, payload);
        addToast('Permission updated successfully', 'success');
      } else {
        await api.post('/permissions', payload);
        addToast('Permission created successfully', 'success');
      }
      router.push('/permissions');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  return (
    <div className="card max-w-2xl">
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                Module Name <span className="text-red-500" style={{ color: 'var(--color-danger)' }}>*</span>
              </label>
              <select 
                {...register('module_id', { required: 'Module is required' })} 
                className={`form-select ${errors.module_id ? 'error' : ''}`}
              >
                <option value="">Select module...</option>
                {MODULES.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {errors.module_id && (
                <p className="form-error">{errors.module_id.message}</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="form-label">Action</label>
              <Input
                {...register('action')}
                placeholder="e.g. view, create, edit, delete"
              />
            </div>
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
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/permissions')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
