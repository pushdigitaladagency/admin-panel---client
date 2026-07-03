'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CountedField } from '@/components/ui/CountedField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';
import { notOnlySpecial, isUrl } from '@/lib/validators';

const EMPLOYMENT_TYPES = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance', 'Remote'];
const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'];
const WORK_MODES = ['On-site', 'Hybrid', 'Remote'];
const SALARY_PERIODS = ['Monthly', 'Annual'];
const STATUSES = ['Draft', 'Published', 'Open', 'Closed', 'On Hold', 'Archived'];

// Rich-text fields in the Description card — each gets its own CKEditor instance.
const DESCRIPTION_FIELDS = [
  { name: 'job_summary', label: 'Job Summary', required: true },
  { name: 'job_description', label: 'Job Description', required: true },
  { name: 'roles_responsibilities', label: 'Roles & Responsibilities', required: true },
  { name: 'key_requirements', label: 'Key Requirements', required: true },
  { name: 'educational_qualification', label: 'Educational Qualification', required: true },
];

const STATUS_BADGE = {
  Published: 'badge-success',
  Open:      'badge-primary',
  Draft:     'badge-warning',
  Closed:    'badge-danger',
  'On Hold': 'badge-info',
  Archived:  'badge-purple',
};

const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const toTitleCase = (str) => {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function CareerPostForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      job_title: initialData?.job_title || '',
      slug: initialData?.slug || '',
      department: initialData?.department || '',
      job_code: initialData?.job_code || '',
      no_of_vacancies: initialData?.no_of_vacancies ?? '',
      employment_type: initialData?.employment_type || 'Full Time',
      experience_level: initialData?.experience_level || 'Fresher',
      work_mode: initialData?.work_mode || 'On-site',
      job_summary: initialData?.job_summary || '',
      job_description: initialData?.job_description || '',
      roles_responsibilities: initialData?.roles_responsibilities || '',
      key_requirements: initialData?.key_requirements || '',
      educational_qualification: initialData?.educational_qualification || '',
      minimum_experience: initialData?.minimum_experience ?? '',
      maximum_experience: initialData?.maximum_experience ?? '',
      salary_min: initialData?.salary_min ?? '',
      salary_max: initialData?.salary_max ?? '',
      salary_currency: initialData?.salary_currency || 'INR',
      salary_period: initialData?.salary_period || 'Monthly',
      hide_salary: initialData?.hide_salary || 'No',
      required_skills: initialData?.required_skills || '',
      preferred_skills: initialData?.preferred_skills || '',
      technologies_tools: initialData?.technologies_tools || '',
      job_location: initialData?.job_location || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      publish_date: initialData?.publish_date ? String(initialData.publish_date).split('T')[0] : '',
      application_deadline: initialData?.application_deadline ? String(initialData.application_deadline).split('T')[0] : '',
      featured_job: initialData?.featured_job || 'No',
      status: toTitleCase(initialData?.status) || 'Draft',
      meta_title: initialData?.meta_title || '',
      meta_keywords: initialData?.meta_keywords || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
    },
  });

  const statusVal = useWatch({ control, name: 'status', defaultValue: toTitleCase(initialData?.status) || 'Draft' });

  const [editorLoaded, setEditorLoaded] = React.useState(false);
  // name -> DOM element / editor instance. Keyed maps keep this generic across
  // the five description editors instead of a ref-pair per field.
  const editableRefs = React.useRef({});
  const toolbarRefs = React.useRef({});
  const instRefs = React.useRef({});

  const jobTitleVal = watch('job_title');

  React.useEffect(() => {
    if (jobTitleVal !== undefined && !isEdit) {
      const generatedSlug = jobTitleVal
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true, shouldDirty: true });
    }
  }, [jobTitleVal, setValue, isEdit, initialData]);

  // Load CKEditor 5 Decoupled Document from CDN (same build as PostForm).
  React.useEffect(() => {
    if (window.DecoupledEditor) {
      setEditorLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@ckeditor/ckeditor5-build-decoupled-document@36.0.1/build/ckeditor.js';
    script.async = true;
    script.onload = () => setEditorLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Register the rich-text fields manually since CKEditor drives their value via
  // setValue (they are not wired through a native <textarea> register()).
  React.useEffect(() => {
    DESCRIPTION_FIELDS.forEach((f) => {
      register(f.name, f.required ? { required: `${f.label} is required` } : {});
    });
  }, [register]);

  // Initialize CKEditors (StrictMode-safe).
  React.useEffect(() => {
    if (!editorLoaded || !window.DecoupledEditor) return;

    const editorConfig = {
      toolbar: [
        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
        'alignment', '|',
        'bold', 'italic', 'underline', '|',
        'bulletedList', 'numberedList', '|',
        'undo', 'redo', 'link',
      ],
      list: { properties: { styles: false, startIndex: false, reversed: false } },
    };

    // The synchronous 'pending' sentinel blocks a second create() on the same
    // element — without it, React StrictMode's double-invoke spawns two editors
    // on one node and the field becomes non-editable.
    const mountEditor = (name, initialValue) => {
      const editableEl = editableRefs.current[name];
      const toolbarEl = toolbarRefs.current[name];
      if (!editableEl || instRefs.current[name]) return;
      instRefs.current[name] = 'pending';
      window.DecoupledEditor.create(editableEl, editorConfig)
        .then((editor) => {
          instRefs.current[name] = editor;
          if (toolbarEl) {
            toolbarEl.innerHTML = '';
            toolbarEl.appendChild(editor.ui.view.toolbar.element);
          }
          editor.setData(initialValue || '');
          editor.model.document.on('change:data', () => {
            setValue(name, editor.getData(), { shouldDirty: true, shouldValidate: true });
          });
        })
        .catch((err) => {
          instRefs.current[name] = null;
          console.error('Error initializing CKEditor:', err);
        });
    };

    DESCRIPTION_FIELDS.forEach((f) => mountEditor(f.name, initialData?.[f.name]));

    return () => {
      // Only destroy fully-initialized editors; skipping the 'pending' sentinel
      // avoids racing an in-flight create() during a StrictMode remount.
      Object.keys(instRefs.current).forEach((name) => {
        const inst = instRefs.current[name];
        if (inst && inst !== 'pending' && typeof inst.destroy === 'function') {
          instRefs.current[name] = null;
          inst.destroy().catch(() => {});
        }
      });
    };
  }, [editorLoaded]);

  // Keep editors synced if initialData arrives/changes after initialization.
  React.useEffect(() => {
    DESCRIPTION_FIELDS.forEach((f) => {
      const inst = instRefs.current[f.name];
      const value = initialData?.[f.name];
      if (inst && inst !== 'pending' && typeof inst.getData === 'function' && value !== undefined) {
        if (inst.getData() !== (value || '')) inst.setData(value || '');
      }
    });
  }, [initialData]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      slug: data.slug || undefined,
      no_of_vacancies: toNum(data.no_of_vacancies),
      minimum_experience: toNum(data.minimum_experience),
      maximum_experience: toNum(data.maximum_experience),
      salary_min: toNum(data.salary_min),
      salary_max: toNum(data.salary_max),
    };
    try {
      if (isEdit) {
        await api.put(`/career-posts/${initialData.id}`, payload);
        addToast('Career post updated successfully', 'success');
      } else {
        await api.post('/career-posts', payload);
        addToast('Career post created successfully', 'success');
      }
      router.push('/career-posts');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const field = (name, label, opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}{opts.required && ' *'}</label>
      <Input
        type={opts.type || 'text'}
        step={opts.step}
        {...register(name, opts.rules)}
        placeholder={opts.placeholder}
        className={errors[name] ? 'error' : ''}
      />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  const selectField = (name, label, options, required) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <select className="form-select" {...register(name, required ? { required: `${label} is required` } : {})}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const ckField = (name, label, required) => (
    <div className="form-group" key={name}>
      <label className="form-label">{label}{required && ' *'}</label>
      <div className="ck-editor-wrapper">
        <div ref={(el) => { toolbarRefs.current[name] = el; }} className="ck-toolbar-container" />
        <div ref={(el) => { editableRefs.current[name] = el; }} className="ck-editor-editable-area" />
      </div>
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  const textArea = (name, label, required) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <textarea
        className={`form-textarea ${errors[name] ? 'error' : ''}`}
        style={{ minHeight: 90 }}
        {...register(name, required ? { required: `${label} is required` } : {})}
      />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Job Details */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Job Details</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('job_title', 'Job Title', { required: true, rules: { required: 'Job title is required', validate: notOnlySpecial } })}
            {field('slug', 'Slug', { placeholder: 'auto-generated if blank' })}
            {field('department', 'Department', { required: true, rules: { required: 'Department is required' } })}
            {field('job_code', 'Job Code')}
            {field('no_of_vacancies', 'No. of Vacancies', { type: 'number', required: true, rules: { required: 'Required' } })}
            {selectField('employment_type', 'Employment Type', EMPLOYMENT_TYPES, true)}
            {selectField('experience_level', 'Experience Level', EXPERIENCE_LEVELS, true)}
            {selectField('work_mode', 'Work Mode', WORK_MODES, true)}
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Description</h3></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
          {DESCRIPTION_FIELDS.map((f) => ckField(f.name, f.label, f.required))}
        </div>
      </div>

      {/* Experience & Salary */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Experience & Salary</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('minimum_experience', 'Minimum Experience (years)', { type: 'number', step: '0.1', required: true, rules: { required: 'Required' } })}
            {field('maximum_experience', 'Maximum Experience (years)', { type: 'number', step: '0.1' })}
            {field('salary_min', 'Salary Min', { type: 'number', step: '0.01' })}
            {field('salary_max', 'Salary Max', { type: 'number', step: '0.01' })}
            {field('salary_currency', 'Salary Currency')}
            {selectField('salary_period', 'Salary Period', SALARY_PERIODS)}
            {selectField('hide_salary', 'Hide Salary', ['No', 'Yes'])}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Skills</h3></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
          {textArea('required_skills', 'Required Skills', true)}
          {textArea('preferred_skills', 'Preferred Skills')}
          {textArea('technologies_tools', 'Technologies / Tools')}
        </div>
      </div>

      {/* Location */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Location</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('job_location', 'Job Location', { required: true, rules: { required: 'Job location is required' } })}
            {field('city', 'City', { required: true, rules: { required: 'City is required' } })}
            {field('state', 'State')}
            {field('country', 'Country', { required: true, rules: { required: 'Country is required' } })}
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Publishing</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('publish_date', 'Publish Date', { type: 'date', required: true, rules: { required: 'Publish date is required' } })}
            {field('application_deadline', 'Application Deadline', { type: 'date', required: true, rules: { required: 'Deadline is required' } })}
            {selectField('featured_job', 'Featured Job', ['No', 'Yes'])}
            {selectField('status', 'Status', STATUSES)}
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">SEO</h3></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px" }}>
          <CountedField control={control} register={register} errors={errors} name="meta_title" label="Meta Title" limit={255} />
          <CountedField control={control} register={register} errors={errors} name="canonical_url" label="Canonical URL" limit={500} rules={{ validate: isUrl }} />
          <CountedField control={control} register={register} errors={errors} name="meta_keywords" label="Meta Keywords" multiline />
          <CountedField control={control} register={register} errors={errors} name="meta_description" label="Meta Description" multiline />
        
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/career-posts')}>Cancel</Button>
      </div>
    </form>
  );
}
