'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import { useApi } from '@/lib/useApi';

export default function ActionLogPage() {
  const { data: logsData, loading, error } = useApi('/action-logs');
  const logs = logsData || [];

  const formattedLogs = logs.map((log) => ({
    id: log.id,
    action: log.action,
    model: log.model || '—',
    user: log.username || 'System',
    ip: log.ip_address || '—',
    date: log.created_at ? new Date(log.created_at).toLocaleString() : '—',
  }));

  const columns = [
    { header: 'Action', accessorKey: 'action' },
    { header: 'Model', accessorKey: 'model' },
    { header: 'User', accessorKey: 'user' },
    { header: 'IP Address', accessorKey: 'ip' },
    { header: 'Date', accessorKey: 'date' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Action Log</h1>
          <p className="page-subtitle">Recent system activities and changes</p>
        </div>
      </div>

      {error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load action logs'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading action logs…</p>
      ) : (
        <DataTable data={formattedLogs} columns={columns} searchKey="action" />
      )}
    </>
  );
}
