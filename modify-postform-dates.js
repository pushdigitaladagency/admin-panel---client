const fs = require('fs');
let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

if (!code.includes("import DatePicker")) {
  code = code.replace(
    `import { useForm } from 'react-hook-form';`,
    `import { useForm, Controller } from 'react-hook-form';\nimport DatePicker from 'react-datepicker';\nimport 'react-datepicker/dist/react-datepicker.css';`
  );
}

// Ensure control is destructured from useForm
if (!code.includes("control,")) {
  code = code.replace(
    `const {\n    register,\n    handleSubmit,\n    watch,\n    setValue,\n    formState: { errors, isSubmitting },\n  } = useForm({`,
    `const {\n    register,\n    control,\n    handleSubmit,\n    watch,\n    setValue,\n    formState: { errors, isSubmitting },\n  } = useForm({`
  );
}

// Regex to match <Input type="date" {...register('fieldname')} /> or multi-line versions
const regex = /<Input\s+type="date"\s+\{\.\.\.register\('([^']+)'\)\}\s*\/>|<Input[\s\S]*?type="date"[\s\S]*?\{\.\.\.register\('([^']+)'\)\}[\s\S]*?\/>/g;

code = code.replace(regex, (match, p1, p2) => {
  const fieldName = p1 || p2;
  return `<Controller
  control={control}
  name="${fieldName}"
  render={({ field: { onChange, onBlur, value } }) => (
    <DatePicker
      onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')}
      onBlur={onBlur}
      selected={value ? new Date(value) : null}
      className="form-input w-full"
      wrapperClassName="w-full"
      dateFormat="yyyy-MM-dd"
      placeholderText="Select date"
    />
  )}
/>`;
});

// For custom styling of react-datepicker
const globalsCssPath = 'src/app/globals.css';
let css = fs.readFileSync(globalsCssPath, 'utf8');
if (!css.includes('.react-datepicker-wrapper')) {
  css += `
/* React Datepicker Custom Styles */
.react-datepicker-wrapper {
  width: 100%;
}
.react-datepicker__input-container input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  outline: none;
}
.react-datepicker__input-container input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
}
.react-datepicker {
  background-color: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  color: var(--color-text) !important;
  font-family: inherit !important;
}
.react-datepicker__header {
  background-color: var(--color-bg-alt) !important;
  border-bottom: 1px solid var(--color-border) !important;
}
.react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
  color: var(--color-text) !important;
}
.react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name {
  color: var(--color-text) !important;
}
.react-datepicker__day:hover {
  background-color: var(--color-bg) !important;
}
.react-datepicker__day--selected {
  background-color: var(--color-primary) !important;
  color: #fff !important;
}
`;
  fs.writeFileSync(globalsCssPath, css);
}

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
