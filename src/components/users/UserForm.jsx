'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';

export function UserForm({ initialData, availableRoles = [], successPath = '/users', cancelPath = '/users' }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [profilePreview, setProfilePreview] = React.useState(initialData?.profile_img || '');
  const dropdownRef = React.useRef(null);

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
          first_name: initialData?.first_name || '',
          last_name: initialData?.last_name || '',
          email: initialData?.email || '',
          username: initialData?.username || '',
          phone: initialData?.phone || '',
          profile_img: initialData?.profile_img || '',
          status: initialData?.status || 'active',
          notes: initialData?.notes || '',
          roles: initialData?.roles ?? [],
        }
      : { first_name: '', last_name: '', email: '', username: '', password: '', password_confirmation: '', phone: '', profile_img: '', status: 'active', notes: '', roles: [] },
  });

  const selectedRoles = watch('roles') || [];
  const password = watch('password') || '';
  const firstName = watch('first_name') || '';
  const lastName = watch('last_name') || '';
  const username = watch('username') || '';
  const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase() || username.slice(0, 2).toUpperCase();

  React.useEffect(() => {
    register('roles', {
      validate: (value) => (value?.length > 0) || 'Select at least one role',
    });
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

  React.useEffect(() => {
    return () => {
      if (profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const onSubmit = async (data) => {
    try {
      void data;
      // Mock network delay
      await new Promise(res => setTimeout(res, 500));

      if (isEdit) {
        addToast('User updated successfully (mock)', 'success');
      } else {
        addToast('User created successfully (mock)', 'success');
      }
      router.push(successPath);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const profileImgRegistration = register('profile_img', {
    validate: (value) => {
      const file = value?.[0];
      if (!file) return true;
      return file.type.startsWith('image/') || 'Select a valid image file';
    },
  });

  return (
    <div className="card max-w-3xl user-form-card">
      <div className="card-header">
        <h3 className="card-title">{isEdit ? 'Edit User' : 'Create User'}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)} className="user-profile-form-layout" noValidate>
          <aside className="user-profile-sidebar">
            <div className="user-profile-avatar">
              {profilePreview ? (
                <img src={profilePreview} alt="" className="user-profile-avatar-image" />
              ) : (
                avatarInitials
              )}
            </div>
            <div className="form-group user-profile-upload">
              <label className="form-label">Profile Image</label>
              <Input
                id="profile-image-input"
                type="file"
                accept="image/*"
                {...profileImgRegistration}
                onChange={(event) => {
                  profileImgRegistration.onChange(event);
                  const file = event.target.files?.[0];
                  if (file) {
                    if (profilePreview.startsWith('blob:')) {
                      URL.revokeObjectURL(profilePreview);
                    }
                    setProfilePreview(URL.createObjectURL(file));
                  }
                }}
                className="user-profile-file-input"
              />
              <label htmlFor="profile-image-input" className="premium-dropzone user-profile-dropzone">
                <ImagePlus size={28} className="premium-dropzone-icon" />
                <span className="premium-dropzone-text">Select profile image</span>
              </label>
              {errors.profile_img && (
                <p className="form-error">{errors.profile_img.message}</p>
              )}
            </div>
          </aside>

          <div className="user-profile-main">
            <section className="user-form-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <Input
                    {...register('first_name', {
                      required: 'First name is required',
                    })}
                    placeholder="John"
                    className={errors.first_name ? 'error' : ''}
                  />
                  {errors.first_name && (
                    <p className="form-error">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <Input
                    {...register('last_name', {
                      required: 'Last name is required',
                    })}
                    placeholder="Doe"
                    className={errors.last_name ? 'error' : ''}
                  />
                  {errors.last_name && (
                    <p className="form-error">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <Input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Enter a valid email',
                      },
                    })}
                    placeholder="Enter your email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <Input
                    {...register('username', {
                      required: 'Username is required',
                    })}
                    placeholder="Enter your name"
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && (
                    <p className="form-error">{errors.username.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Password {isEdit && '(leave blank to keep)'}</label>
                  <Input
                    type="password"
                    {...register('password', {
                      required: isEdit ? false : 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    placeholder="********"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && (
                    <p className="form-error">{errors.password.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <Input
                    type="password"
                    {...register('password_confirmation', {
                      validate: (value) => {
                        if (isEdit && !password && !value) return true;
                        return value === password || 'Passwords do not match';
                      },
                    })}
                    placeholder="********"
                    className={errors.password_confirmation ? 'error' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="form-error">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="user-form-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <Input
                    type="tel"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+91\s?\d{3}\s?\d{3}\s?\d{4}$/,
                        message: 'Enter a valid +91 phone number',
                      },
                    })}
                    placeholder="+91 234 567 8900"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && (
                    <p className="form-error">{errors.phone.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    {...register('status', {
                      required: 'Status is required',
                    })}
                    className={`form-select ${errors.status ? 'error' : ''}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="form-error">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Roles</label>
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
                      {selectedRoles.length === 0
                        ? 'Select roles...'
                        : selectedRoles.map(rid => availableRoles.find(r => r.id === rid)?.name || `Role #${rid}`).join(', ')}
                    </span>
                    <span className="ml-2 text-gray-500 font-semibold" style={{ fontSize: '10px' }}>v</span>
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
                      {availableRoles.map((role) => {
                        const isChecked = selectedRoles.includes(role.id);
                        return (
                          <label
                            key={role.id}
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
                                  ? selectedRoles.filter((id) => id !== role.id)
                                  : [...selectedRoles, role.id];
                                setValue('roles', newSelection, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }}
                            />
                            <span style={{ color: 'var(--color-text)' }}>{role.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                {errors.roles && (
                  <p className="form-error">{errors.roles.message}</p>
                )}
              </div>
            </section>

            <section className="user-form-section">
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  {...register('notes')}
                  className="form-textarea"
                  placeholder="Internal notes about this user..."
                  style={{ minHeight: '44px' }}
                />
              </div>
            </section>

            <div className="mt-6 flex justify-end gap-3 user-form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(cancelPath)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save User'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
