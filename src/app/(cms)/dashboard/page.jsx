'use client';

import Link from 'next/link';
import { Users, Shield, ShieldAlert, Image as ImageIcon, FileText, Calendar, Mail, FileEdit, ArrowRight } from 'lucide-react';
import { UserGrowthChart } from '@/components/dashboard/UserGrowthChart';
import { PostActivityChart } from '@/components/dashboard/PostActivityChart';
import { RecentPostsCard } from '@/components/dashboard/RecentPostsCard';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: statsData, loading: statsLoading } = useApi('/dashboard/stats');
  const { data: recentData, loading: recentLoading } = useApi('/dashboard/recent');

  const s = statsData || {};
  const recentPosts = recentData || [];

  const stats = [
    {
      label: 'Users',
      value: s.users ?? '—',
      icon: <Users size={22} />,
      color: '#3b82f6',
      bg: '#3b82f6',
      href: '/users',
    },
    {
      label: 'Roles',
      value: s.roles ?? '—',
      icon: <Shield size={22} />,
      color: '#10b981',
      bg: '#10b981',
      href: '/roles',
    },
    {
      label: 'Permissions',
      value: s.permissions ?? '—',
      icon: <ShieldAlert size={22} />,
      color: '#f43f5e',
      bg: '#f43f5e',
      href: '/permissions',
    },
    {
      label: 'Press Releases',
      value: s.pressReleases ?? '—',
      icon: <FileEdit size={22} />,
      color: '#8b5cf6',
      bg: '#8b5cf6',
      href: '/posts/press-release',
    },
    {
      label: 'News',
      value: s.news ?? '—',
      icon: <FileText size={22} />,
      color: '#f59e0b',
      bg: '#f59e0b',
      href: '/posts/news',
    },
    {
      label: 'Events',
      value: s.events ?? '—',
      icon: <Calendar size={22} />,
      color: '#06b6d4',
      bg: '#06b6d4',
      href: '/posts/event',
    },
    {
      label: 'Gallery',
      value: s.galleryAlbums ?? '—',
      icon: <ImageIcon size={22} />,
      color: '#ec4899',
      bg: '#ec4899',
      href: '/media',
    },
    {
      label: 'Enquiries',
      value: s.enquiries ?? '—',
      icon: <Mail size={22} />,
      color: '#6366f1',
      bg: '#6366f1',
      href: '/enquiry',
    },
  ];
  console.log(user);

  return (
    <>
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>Dashboard</h1>
          <p className="page-subtitle" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Welcome back {user?.role?.name || 'User'} ! Here's an overview.</p>
        </div>
      </div>

      <div className="stats-grid mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ 
              '--stat-accent': stat.color, 
              flexDirection: 'column', 
              gap: '0', 
              padding: '0',
              background: 'var(--color-bg-alt)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Card content */}
            <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Icon */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  minWidth: '54px',
                  minHeight: '54px',
                  borderRadius: '12px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                  boxShadow: `0 8px 16px -4px ${stat.color}60`,
                  aspectRatio: '1 / 1',
                }}
              >
                {stat.icon}
              </div>

              {/* Label + Value */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1 }}>
                  {statsLoading ? '…' : stat.value}
                </div>
              </div>
            </div>

            {/* View all link */}
            <div style={{ 
              padding: '12px 24px', 
              borderTop: '1px solid rgba(0,0,0,0.04)',
              background: 'var(--color-surface)',
              width: '100%'
            }}>
              <Link
                href={stat.href}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#6366f1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  transition: 'gap 0.2s ease',
                }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <UserGrowthChart data={s.userGrowth} loading={statsLoading} />
      <div style={{ display: 'grid', gap: '24px', alignItems: 'stretch' }} className="dashboard-charts-container mb-6">
        <PostActivityChart data={s.postActivity} loading={statsLoading} />

        <RecentPostsCard posts={recentPosts} loading={recentLoading} />
      </div>
    </>
  );
}
