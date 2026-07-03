'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { ImagePlus } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { api, uploadFile, BASE_URL } from '@/lib/api';

const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseHost = BASE_URL.replace(/\/api$/, '');
  return `${baseHost}/${path.replace(/^\/?/, '')}`;
};

export function UserForm({ 
  initialData, 
  availableRoles = [], 
  isProfile = false, 
  onSuccess,
  successPath = '/users', 
  cancelPath = '/users' 
}) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = React.useState(!isProfile);

  const initialImage = initialData?.profile_image || initialData?.profile_img || '';
  const [profilePreview, setProfilePreview] = React.useState(
    initialImage ? resolveImageUrl(initialImage) : ''
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: isEdit
      ? {
          id: initialData?.id,
          first_name: initialData?.first_name || '',
          last_name: initialData?.last_name || '',
          email: initialData?.email || '',
          username: initialData?.username || '',
          phone: initialData?.mobile_number || initialData?.phone || '',
          profile_img: initialData?.profile_image || initialData?.profile_img || '',
          status: initialData?.status === false || initialData?.status === 'inactive' ? 'inactive' : 'active',
          notes: initialData?.notes || '',
          role_id: initialData?.role_id ? String(initialData.role_id) : (initialData?.roles?.[0] ? String(initialData.roles[0]) : ''),
        }
      : { first_name: '', last_name: '', email: '', username: '', password: '', password_confirmation: '', phone: '', profile_img: '', status: 'active', notes: '', role_id: '' },
  });

  const password = watch('password') || '';
  const firstName = watch('first_name') || '';
  const lastName = watch('last_name') || '';
  const username = watch('username') || '';
  const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.trim().toUpperCase() || username.slice(0, 2).toUpperCase();

  React.useEffect(() => {
    if (!isEditing && initialData) {
      const mapped = isProfile
        ? {
            id: initialData?.id,
            first_name: initialData?.first_name || '',
            last_name: initialData?.last_name || '',
            email: initialData?.email || '',
            username: initialData?.username || '',
            phone: initialData?.mobile_number || initialData?.phone || '',
            profile_img: initialData?.profile_image || initialData?.profile_img || '',
          }
        : {
            id: initialData?.id,
            first_name: initialData?.first_name || '',
            last_name: initialData?.last_name || '',
            email: initialData?.email || '',
            username: initialData?.username || '',
            phone: initialData?.mobile_number || initialData?.phone || '',
            profile_img: initialData?.profile_image || initialData?.profile_img || '',
            status: initialData?.status === false || initialData?.status === 'inactive' ? 'inactive' : 'active',
            notes: initialData?.notes || '',
            role_id: initialData?.role_id ? String(initialData.role_id) : (initialData?.roles?.[0] ? String(initialData.roles[0]) : ''),
          };
      reset(mapped);
      const img = initialData?.profile_image || initialData?.profile_img || '';
      setProfilePreview(img ? resolveImageUrl(img) : '');
    }
  }, [initialData, reset, isProfile, isEditing]);

  React.useEffect(() => {
    return () => {
      if (profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const onSubmit = async (data) => {
    try {
      let profileImagePath = initialData?.profile_image || initialData?.profile_img || '';
      
      // Upload the profile image file if selected
      if (data.profile_img?.[0] instanceof File) {
        const uploaded = await uploadFile(data.profile_img[0]);
        profileImagePath = uploaded?.path || uploaded?.filename || '';
      }

      if (isProfile) {
        // Self profile update payload mapping
        const payload = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          username: data.username,
          mobile_number: data.phone || null,
          profile_image: profileImagePath,
        };
        if (data.password) {
          payload.password_hash = data.password;
        }

        await api.put('/me', payload);
        addToast('Profile updated successfully', 'success');
        setIsEditing(false);
        if (onSuccess) await onSuccess();
      } else {
        // Admin user management payload mapping
        const payload = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          username: data.username,
          mobile_number: data.phone || null,
          profile_image: profileImagePath,
          role_id: data.role_id ? Number(data.role_id) : null,
          status: data.status === 'active' || data.status === true,
          notes: data.notes || '',
        };
        if (data.password) {
          payload.password_hash = data.password;
        }

        if (isEdit) {
          await api.put(`/users/${initialData.id}`, payload);
          addToast('User updated successfully', 'success');
        } else {
          await api.post('/users', payload);
          addToast('User created successfully', 'success');
        }
      }
      
      router.push(successPath);
    } catch (err) {
      addToast(err.message || 'Operation failed', 'danger');
    }
  };

  const handleCancel = () => {
    if (isProfile) {
      reset();
      setProfilePreview(initialImage ? resolveImageUrl(initialImage) : '');
      setIsEditing(false);
    } else {
      router.push(cancelPath);
    }
  };

  const profileImgRegistration = register('profile_img', {
    validate: (value) => {
      const file = value?.[0];
      if (!file || !(file instanceof File)) return true;
      return file.type?.startsWith('image/') || 'Select a valid image file';
    },
  });

  return (
    <div className="card max-w-3xl user-form-card">
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
                disabled={!isEditing}
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
              <label 
                htmlFor={isEditing ? "profile-image-input" : undefined} 
                className="premium-dropzone user-profile-dropzone"
                style={{ 
                  cursor: isEditing ? 'pointer' : 'default', 
                  opacity: isEditing ? 1 : 0.6,
                  pointerEvents: isEditing ? 'auto' : 'none'
                }}
              >
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
                      pattern: {
                        value: /^[A-Za-z][A-Za-z .'-]*$/,
                        message: "Only letters, spaces, hyphens and apostrophes are allowed",
                      },
                    })}
                    placeholder="Enter your first name"
                    className={errors.first_name ? 'error' : ''}
                    disabled={!isEditing}
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
                      pattern: {
                        value: /^[A-Za-z][A-Za-z .'-]*$/,
                        message: "Only letters, spaces, hyphens and apostrophes are allowed",
                      },
                    })}
                    placeholder="Enter your last name"
                    className={errors.last_name ? 'error' : ''}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    placeholder="Enter username"
                    className={errors.username ? 'error' : ''}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                  {errors.password_confirmation && (
                    <p className="form-error">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="user-form-section">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group" style={{ gridColumn: isProfile ? 'span 2' : 'span 1' }}>
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
                    disabled={!isEditing}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9+\s]/g, '');
                      e.target.value = cleaned;
                      register('phone').onChange(e);
                    }}
                  />
                  {errors.phone && (
                    <p className="form-error">{errors.phone.message}</p>
                  )}
                </div>

                {!isProfile && (
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
                )}
              </div>

              {isProfile ? (
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <div
                    className="profile-readonly-field"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      minHeight: '40px',
                      color: 'var(--color-text)',
                      opacity: 0.8,
                      cursor: 'default',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, var(--color-primary), #3b82f6)',
                        color: '#fff',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {(() => {
                        const roleId = initialData?.role_id;
                        const roleName = availableRoles.find(r => r.id === roleId)?.name
                          || initialData?.role?.name
                          || 'Unknown';
                        return roleName;
                      })()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>Read-only</span>
                  </div>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    {...register('role_id', {
                      required: 'Role selection is required',
                    })}
                    className={`form-select ${errors.role_id ? 'error' : ''}`}
                  >
                    <option value="">Select role...</option>
                    {availableRoles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {errors.role_id && (
                    <p className="form-error">{errors.role_id.message}</p>
                  )}
                </div>
              )}
            </section>

            <section className="user-form-section">
              <div className="form-group">
                <label className="form-label">Notes {isProfile && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>(Read-only)</span>}</label>
                {isProfile ? (
                  <div
                    className="profile-readonly-field"
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      minHeight: '44px',
                      color: initialData?.notes ? 'var(--color-text)' : 'var(--color-text-muted)',
                      opacity: 0.8,
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      cursor: 'default',
                    }}
                  >
                    {initialData?.notes || 'No notes'}
                  </div>
                ) : (
                  <textarea
                    {...register('notes')}
                    className="form-textarea"
                    placeholder="Internal notes about this user..."
                    style={{ minHeight: '44px' }}
                  />
                )}
              </div>
            </section>

            <div className="mt-6 flex justify-end gap-3 user-form-actions">
              {isProfile && !isEditing ? (
                <>
                  <Button
                    key="btn-edit-profile"
                    type="button"
                    variant="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    key="btn-dashboard"
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(cancelPath);
                    }}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    key="btn-save"
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    key="btn-cancel"
                    type="button"
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancel();
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
