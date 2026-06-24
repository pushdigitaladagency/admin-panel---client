'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';

export default function ActionLogPage() {
  // Mock data
  const formattedLogs = [
    { id: 1, action: 'Created Post', model: 'Post', user: 'Admin User', ip: '192.168.1.10', date: new Date().toLocaleString() },
    { id: 2, action: 'Updated Settings', model: 'Setting', user: 'Admin User', ip: '192.168.1.10', date: new Date(Date.now() - 3600000).toLocaleString() },
    { id: 3, action: 'Deleted User', model: 'User', user: 'Editor Jane', ip: '10.0.0.5', date: new Date(Date.now() - 86400000).toLocaleString() },
    { id: 4, action: 'System Backup', model: 'System', user: 'System', ip: '127.0.0.1', date: new Date(Date.now() - 172800000).toLocaleString() },
  ];

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

      <DataTable data={formattedLogs} columns={columns} searchKey="action" />
    </>
  );
}
