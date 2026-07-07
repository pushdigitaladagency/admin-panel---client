'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function RecentPostsCard({ posts = [], loading = false }) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="card" style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', height: isOpen ? '100%' : 'auto', alignSelf: isOpen ? 'stretch' : 'start', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ padding: isOpen ? '24px 24px 16px 24px' : '24px', borderBottom: 'none' }}>
        <h3 className="card-title" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Recent Posts</h3>
        <button
          type="button"
          aria-label={isOpen ? 'Collapse recent posts' : 'Expand recent posts'}
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
        >
          <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {isOpen && (
        <div className="data-table-wrapper recent-posts-wrapper" style={{ padding: '0 24px 24px 24px' }}>
          <table className="data-table recent-posts-table" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Title</th>
                <th style={{ width: '25%' }}>Type</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '20%' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="data-table-empty">
                    Loading...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="data-table-empty">
                    No posts yet
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={`${post.post_type}-${post.id}`}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.title}
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {post.post_type ? post.post_type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ''}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span
                        className={`badge ${
                          (post.status || '').toLowerCase() === 'published'
                            ? 'badge-success'
                            : (post.status || '').toLowerCase() === 'draft'
                            ? 'badge-warning'
                            : (post.status || '').toLowerCase() === 'ongoing'
                            ? 'badge-purple'
                            : (post.status || '').toLowerCase() === 'upcoming'
                            ? 'badge-primary'
                            : 'badge-primary'
                        }`}
                      >
                        {post.status ? post.status.charAt(0).toUpperCase() + post.status.slice(1).toLowerCase() : 'Draft'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
