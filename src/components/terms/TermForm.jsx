'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useTerms } from '@/context/TermsContext';
import { formatTaxonomyLabel } from '@/utils/taxonomyLabels';

export function TermForm({ initialData, taxonomy }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();
  const { addTerm, updateTerm } = useTerms();
  const taxonomyLabel = formatTaxonomyLabel(taxonomy);

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
          slug: initialData?.slug || '',
          description: initialData?.description || '',
          status: initialData?.status || 'Active',
          taxonomy: taxonomy,
        }
      : { name: '', slug: '', description: '', status: 'Active', taxonomy: taxonomy },
  });

  // Auto-generate the slug from the name, in both create and edit (same as the
  // content modules). Runs on every name change so the slug always tracks the name.
  const nameVal = watch('name');
  React.useEffect(() => {
    if (nameVal !== undefined) {
      const generatedSlug = nameVal
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [nameVal, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateTerm(taxonomy, initialData.id, data);
        addToast(`${taxonomyLabel} updated successfully`, 'success');
      } else {
        await addTerm(taxonomy, data);
        addToast(`${taxonomyLabel} created successfully`, 'success');
      }
      router.push(`/terms/${taxonomy}`);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  return (
    <div className="card max-w-2xl">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? `Edit ${taxonomyLabel}` : `Create ${taxonomyLabel}`}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <Input
              {...register('name', { required: 'Name is required' })}
              placeholder="Enter name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <Input
              {...register('slug')}
              placeholder="Auto-generated if left blank"
              className={errors.slug ? 'error' : ''}
            />
            {errors.slug && <p className="form-error">{errors.slug.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              placeholder="Optional description"
              style={{ minHeight: '100px' }}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" {...register('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push(`/terms/${taxonomy}`)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
