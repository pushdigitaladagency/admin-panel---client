const fs = require('fs');
const { execSync } = require('child_process');

execSync('node inject-fields.js');

let code = fs.readFileSync('src/components/posts/PostForm.jsx', 'utf8');

if (code.includes('          </div>\n        </form>')) {
  code = code.replace(
    '          </div>\n        </form>',
    '          </div>\n          )}\n        </form>'
  );
}

code = code.replace(/router\.push\(\`\/posts\/\$\{postType\}\`\)/g, "router.push(postType === 'enquiry' ? '/enquiry' : `/posts/\${postType}`)")

if (!code.includes("import DatePicker")) {
  code = code.replace(
    `import { useForm } from 'react-hook-form';`,
    `import { useForm, Controller } from 'react-hook-form';\nimport DatePicker from 'react-datepicker';\nimport 'react-datepicker/dist/react-datepicker.css';`
  );
}

code = code.replace(
  /const\s*\{\s*register,\s*handleSubmit,/g,
  "const {\n    register,\n    control,\n    handleSubmit,"
);

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
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('event_start_date', \\{ required: 'Event Start Date is required' \\}\\)\\}\\s+className=\\{errors\\.event_start_date \\? 'error' : ''\\}\\s+\\/>`,
    new: `<Controller control={control} name="event_start_date" rules={{ required: 'Event Start Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={\`form-input w-full \${errors.event_start_date ? 'error' : ''}\`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('event_end_date', \\{ required: 'Event End Date is required' \\}\\)\\}\\s+className=\\{errors\\.event_end_date \\? 'error' : ''\\}\\s+\\/>`,
    new: `<Controller control={control} name="event_end_date" rules={{ required: 'Event End Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={\`form-input w-full \${errors.event_end_date ? 'error' : ''}\`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('reg_start_date'\\)\\}\\s+\\/>`,
    new: `<Controller control={control} name="reg_start_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('reg_end_date'\\)\\}\\s+\\/>`,
    new: `<Controller control={control} name="reg_end_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('publish_date', \\{ required: 'Publish Date is required' \\}\\)\\}\\s+className=\\{errors\\.publish_date \\? 'error' : ''\\}\\s+\\/>`,
    new: `<Controller control={control} name="publish_date" rules={{ required: 'Publish Date is required' }} render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className={\`form-input w-full \${errors.publish_date ? 'error' : ''}\`} wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  },
  {
    old: `<Input\\s+type="date"\\s+\\{\\.\\.\\.register\\('expiry_date'\\)\\}\\s+\\/>`,
    new: `<Controller control={control} name="expiry_date" render={({ field: { onChange, onBlur, value } }) => (<DatePicker onChange={(date) => onChange(date ? date.toISOString().split('T')[0] : '')} onBlur={onBlur} selected={value ? new Date(value) : null} className="form-input w-full" wrapperClassName="w-full" dateFormat="yyyy-MM-dd" placeholderText="Select date" />)} />`
  }
];

for (let rep of replacements) {
  if (rep.old.includes('\\s+')) {
    const safeRegex = new RegExp(rep.old, 'g');
    code = code.replace(safeRegex, rep.new);
  } else {
    code = code.replace(rep.old, rep.new);
  }
}

fs.writeFileSync('src/components/posts/PostForm.jsx', code);
console.log('All fixes applied successfully!');
