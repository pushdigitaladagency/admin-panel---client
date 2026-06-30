'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthContext';
import { NoAccess } from '@/components/ui/NoAccess';
import { api, BASE_URL } from '@/lib/api';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';

const resolveUrl = (p) => (!p ? '' : p.startsWith('http') ? p : `${BASE_URL.replace(/\/api$/, '')}/${p.replace(/^\/?/, '')}`);

export default function LogoListPage() {
  const { can } = useAuth();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();
  const canView = can('client_partner_logos', 'view');
  const { data, loading, error, reload } = useApi('/client-partner-logos', { enabled: canView });
  const rows = data || [];

  const handleDelete = (id) => {
    confirmDelete('Are you sure you want to delete this logo?', async () => {
      try {
        await api.del(`/client-partner-logos/${id}`);
        addToast('Logo deleted successfully', 'success');
        reload();
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const columns = [
    {
      header: 'Logo',
      render: (row) => row.logo_image
        ? <img src={resolveUrl(row.logo_image)} alt={row.alt_text || ''} style={{ width: 40, height: 40, objectFit: 'contain' }} />
        : '—',
    },
    { header: 'Name', render: (row) => row.client_partner_name },
    { header: 'Category', render: (row) => <span className="badge badge-info">{row.category}</span> },
    { header: 'Order', render: (row) => row.display_order ?? 0 },
    { header: 'Featured', render: (row) => <span className={`badge ${row.featured === 'Yes' ? 'badge-success' : 'badge-danger'}`}>{row.featured || 'No'}</span> },
    { header: 'Status', render: (row) => <span className={`badge ${row.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{row.status || 'Active'}</span> },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/client-partner-logos/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1"><Pencil size={14} /> Edit</Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}><Trash2 size={14} /> Delete</button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Client &amp; Partner Logos</h1>
          <p className="page-subtitle">Manage client, partner and sponsor logos</p>
        </div>
        {canView && error?.status !== 403 && (
          <Link href="/client-partner-logos/create" className="btn btn-primary">+ New Logo</Link>
        )}
      </div>

      {(!canView || error?.status === 403) ? (
        <NoAccess module="client_partner_logos" action="view" />
      ) : error ? (
        <p className="form-error" style={{ padding: '16px 0' }}>{error.message || 'Failed to load logos'}</p>
      ) : loading ? (
        <p className="text-muted" style={{ padding: '16px 0' }}>Loading logos…</p>
      ) : (
        <DataTable data={rows} columns={columns} searchKey="client_partner_name" filterOptions={['Client', 'Partner', 'Sponsor']} filterKey={(row) => row.category} />
      )}
    </>
  );
}
