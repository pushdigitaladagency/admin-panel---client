const fs = require('fs');
let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

// Ensure DatePicker is imported
if (!code.includes("import DatePicker")) {
  code = code.replace(
    `import { useForm } from 'react-hook-form';`,
    `import { useForm, Controller } from 'react-hook-form';\nimport DatePicker from 'react-datepicker';\nimport 'react-datepicker/dist/react-datepicker.css';`
  );
}

// Ensure control is destructured
if (!code.includes("    control,")) {
  code = code.replace(
    `    register,\n    handleSubmit,`,
    `    register,\n    control,\n    handleSubmit,`
  );
}

// Replacements
const replacements = [
  {
    old: `<Input type="date" {...register('submitted_date')} />`,
    new: `<Controller control={control} name="submitted_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input type="date" {...register('response_date')} />`,
    new: `<Controller control={control} name="response_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                        type="date"\n                        {...register('event_start_date', { required: 'Event Start Date is required' })}\n                      />`,
    new: `<Controller control={control} name="event_start_date" rules={{ required: 'Event Start Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                        type="date"\n                        {...register('event_end_date', { required: 'Event End Date is required' })}\n                      />`,
    new: `<Controller control={control} name="event_end_date" rules={{ required: 'Event End Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                        type="date"\n                        {...register('reg_start_date')}\n                      />`,
    new: `<Controller control={control} name="reg_start_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                        type="date"\n                        {...register('reg_end_date')}\n                      />`,
    new: `<Controller control={control} name="reg_end_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                      type="date"\n                      {...register('publish_date', { required: 'Publish Date is required' })}\n                    />`,
    new: `<Controller control={control} name="publish_date" rules={{ required: 'Publish Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\n                        type="date"\n                        {...register('expiry_date')}\n                      />`,
    new: `<Controller control={control} name="expiry_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  }
];

for (let rep of replacements) {
  // Try to replace exact string or fallback to regex for whitespace flexibility
  if (code.includes(rep.old)) {
    code = code.replace(rep.old, rep.new);
  } else {
    // Escape regex characters except newlines and spaces
    const safeRegexStr = rep.old.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&').replace(/\\s+/g, '\\s+');
    const safeRegex = new RegExp(safeRegexStr, 'g');
    code = code.replace(safeRegex, rep.new);
  }
}

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
