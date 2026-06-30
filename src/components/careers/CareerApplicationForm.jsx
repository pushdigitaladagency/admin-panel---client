'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadField } from '@/components/ui/UploadField';
import { useToast } from '@/components/ui/Toast';
import { api } from '@/lib/api';

const GENDERS = ['', 'Male', 'Female', 'Other'];
const STATUSES = ['New', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'On Hold'];
const INTERVIEW_MODES = ['', 'Online', 'In-person'];

const toNum = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
const dateOnly = (v) => (v ? String(v).split('T')[0] : '');

export function CareerApplicationForm({ initialData }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [resume, setResume] = React.useState(initialData?.resume_cv || '');
  const [coverAttachment, setCoverAttachment] = React.useState(initialData?.cover_letter_attachment || '');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      full_name: initialData?.full_name || '',
      email: initialData?.email || '',
      mobile_number: initialData?.mobile_number || '',
      date_of_birth: dateOnly(initialData?.date_of_birth),
      gender: initialData?.gender || '',
      current_location: initialData?.current_location || '',
      linkedin_profile: initialData?.linkedin_profile || '',
      portfolio_website: initialData?.portfolio_website || '',
      cover_letter: initialData?.cover_letter || '',
      applied_position: initialData?.applied_position || '',
      department: initialData?.department || '',
      job_code: initialData?.job_code || '',
      preferred_location: initialData?.preferred_location || '',
      total_experience: initialData?.total_experience ?? '',
      current_company: initialData?.current_company || '',
      current_designation: initialData?.current_designation || '',
      current_ctc: initialData?.current_ctc ?? '',
      expected_ctc: initialData?.expected_ctc ?? '',
      notice_period: initialData?.notice_period || '',
      highest_qualification: initialData?.highest_qualification || '',
      specialization: initialData?.specialization || '',
      university_institution: initialData?.university_institution || '',
      year_of_passing: initialData?.year_of_passing ?? '',
      percentage_cgpa: initialData?.percentage_cgpa || '',
      application_status: initialData?.application_status || 'New',
      admin_notes: initialData?.admin_notes || '',
      internal_rating: initialData?.internal_rating ?? '',
      assigned_to: initialData?.assigned_to || '',
      follow_up_date: dateOnly(initialData?.follow_up_date),
      interview_date: initialData?.interview_date ? String(initialData.interview_date).slice(0, 16) : '',
      interview_mode: initialData?.interview_mode || '',
      follow_up_notes: initialData?.follow_up_notes || '',
      response_date: dateOnly(initialData?.response_date),
    },
  });

  const onSubmit = async (data) => {
    if (!resume) {
      addToast('Resume / CV is required', 'danger');
      return;
    }
    const payload = {
      ...data,
      resume_cv: resume,
      cover_letter_attachment: coverAttachment || null,
      total_experience: toNum(data.total_experience),
      current_ctc: toNum(data.current_ctc),
      expected_ctc: toNum(data.expected_ctc),
      year_of_passing: toNum(data.year_of_passing),
      internal_rating: toNum(data.internal_rating),
      gender: data.gender || null,
      interview_mode: data.interview_mode || null,
      interview_date: data.interview_date || null,
    };
    try {
      if (isEdit) {
        await api.put(`/career-applications/${initialData.id}`, payload);
        addToast('Application updated successfully', 'success');
      } else {
        await api.post('/career-applications', payload);
        addToast('Application created successfully', 'success');
      }
      router.push('/career-applications');
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const field = (name, label, opts = {}) => (
    <div className="form-group">
      <label className="form-label">{label}{opts.required && ' *'}</label>
      <Input type={opts.type || 'text'} step={opts.step} {...register(name, opts.rules)} className={errors[name] ? 'error' : ''} />
      {errors[name] && <p className="form-error">{errors[name].message}</p>}
    </div>
  );

  const selectField = (name, label, options, required) => (
    <div className="form-group">
      <label className="form-label">{label}{required && ' *'}</label>
      <select className="form-select" {...register(name, required ? { required: `${label} is required` } : {})}>
        {options.map((o) => <option key={o} value={o}>{o || '— Select —'}</option>)}
      </select>
    </div>
  );

  const textArea = (name, label) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <textarea className="form-textarea" style={{ minHeight: 80 }} {...register(name)} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Candidate */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Candidate</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('full_name', 'Full Name', { required: true, rules: { required: 'Full name is required' } })}
            {field('email', 'Email', { type: 'email', required: true, rules: { required: 'Email is required' } })}
            {field('mobile_number', 'Mobile Number', { required: true, rules: { required: 'Mobile number is required' } })}
            {field('date_of_birth', 'Date of Birth', { type: 'date' })}
            {selectField('gender', 'Gender', GENDERS)}
            {field('current_location', 'Current Location')}
            {field('linkedin_profile', 'LinkedIn Profile')}
            {field('portfolio_website', 'Portfolio Website')}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Documents</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UploadField label="Resume / CV *" accept=".pdf,.doc,.docx" value={resume} onChange={setResume} preview={false} />
            <UploadField label="Cover Letter Attachment" accept=".pdf,.doc,.docx" value={coverAttachment} onChange={setCoverAttachment} preview={false} />
          </div>
          {textArea('cover_letter', 'Cover Letter')}
        </div>
      </div>

      {/* Position */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Position Applied</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('applied_position', 'Applied Position', { required: true, rules: { required: 'Applied position is required' } })}
            {field('department', 'Department')}
            {field('job_code', 'Job Code')}
            {field('preferred_location', 'Preferred Location')}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Experience</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('total_experience', 'Total Experience (years)', { type: 'number', step: '0.1', required: true, rules: { required: 'Required' } })}
            {field('current_company', 'Current Company')}
            {field('current_designation', 'Current Designation')}
            {field('current_ctc', 'Current CTC', { type: 'number', step: '0.01' })}
            {field('expected_ctc', 'Expected CTC', { type: 'number', step: '0.01' })}
            {field('notice_period', 'Notice Period')}
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Education</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field('highest_qualification', 'Highest Qualification', { required: true, rules: { required: 'Required' } })}
            {field('specialization', 'Specialization')}
            {field('university_institution', 'University / Institution')}
            {field('year_of_passing', 'Year of Passing', { type: 'number' })}
            {field('percentage_cgpa', 'Percentage / CGPA')}
          </div>
        </div>
      </div>

      {/* Admin workflow */}
      <div className="card">
        <div className="card-header"><h3 className="card-title">Admin Workflow</h3></div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectField('application_status', 'Application Status', STATUSES)}
            {field('internal_rating', 'Internal Rating (0–5)', { type: 'number' })}
            {field('assigned_to', 'Assigned To')}
            {field('follow_up_date', 'Follow-up Date', { type: 'date' })}
            {field('interview_date', 'Interview Date', { type: 'datetime-local' })}
            {selectField('interview_mode', 'Interview Mode', INTERVIEW_MODES)}
            {field('response_date', 'Response Date', { type: 'date' })}
          </div>
          {textArea('admin_notes', 'Admin Notes')}
          {textArea('follow_up_notes', 'Follow-up Notes')}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/career-applications')}>Cancel</Button>
      </div>
    </form>
  );
}
