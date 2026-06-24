'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export function ProfileForm({ user }) {
  const { addToast } = useToast();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      password: '',
      password_confirmation: '',
    }
  });

  const onSubmit = async (data) => {
    try {
      if (data.password && data.password !== data.password_confirmation) {
        throw new Error("Passwords don't match");
      }
      
      // Mock network delay
      await new Promise(res => setTimeout(res, 500));
      
      addToast('Profile updated successfully (mock)', 'success');
    } catch (err) {
      addToast(err.message || 'Update failed', 'danger');
    }
  };

  return (
    <div className="card max-w-2xl">
      <div className="card-header">
        <h3 className="card-title">Profile Settings</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <Input {...register('first_name')} />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <Input {...register('last_name')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <Input type="email" {...register('email')} disabled />
            <p className="text-sm text-muted mt-1">Email cannot be changed here.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <Input type="password" {...register('password')} placeholder="Leave blank to keep" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <Input type="password" {...register('password_confirmation')} />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
