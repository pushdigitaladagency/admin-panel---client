'use client';

import React from 'react';
import DataTable from '@/components/ui/DataTable';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTerms } from '@/context/TermsContext';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/context/ConfirmContext';
import { Pencil, Trash2 } from 'lucide-react';
import { formatTaxonomyLabel, pluralizeTaxonomyLabel } from '@/utils/taxonomyLabels';

export default function TermListPage() {
  const params = useParams();
  const taxonomy = params.taxonomy || 'category';
  const { getTerms, deleteTerm, deleteTerms } = useTerms();
  const { addToast } = useToast();
  const { confirmDelete } = useConfirm();

  const terms = getTerms(taxonomy);
  const taxonomyLabel = formatTaxonomyLabel(taxonomy);
  const taxonomyPluralLabel = pluralizeTaxonomyLabel(taxonomy);

  const handleDelete = async (id) => {
    confirmDelete('Are you sure you want to delete this term?', async () => {
      try {
        await deleteTerm(taxonomy, id);
        addToast('Term deleted successfully', 'success');
      } catch (err) {
        addToast(err.message || 'Delete failed', 'danger');
      }
    });
  };

  const handleBulkDelete = async (ids) => {
    confirmDelete(`Are you sure you want to delete ${ids.length} terms?`, async () => {
      try {
        await deleteTerms(taxonomy, ids);
        addToast(`${ids.length} terms deleted`, 'success');
      } catch (err) {
        addToast(err.message || 'Bulk delete failed', 'danger');
      }
    });
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Slug', accessorKey: 'slug' },
    {
      header: 'Status',
      render: (row) => {
        const active = row.status === true || row.status === 'active' || row.status === 1;
        return <span className={`badge ${active ? 'badge-success' : 'badge-danger'}`}>{active ? 'Active' : 'Inactive'}</span>;
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link href={`/terms/${taxonomy}/${row.id}/edit`} className="btn btn-secondary btn-sm flex items-center gap-1">
            <Pencil size={14} /> Edit
          </Link>
          <button className="btn btn-danger btn-sm flex items-center gap-1" onClick={() => handleDelete(row.id)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{taxonomyPluralLabel}</h1>
          <p className="page-subtitle">Manage {taxonomyLabel} taxonomy</p>
        </div>
        <Link href={`/terms/${taxonomy}/create`} className="btn btn-primary">
          + New {taxonomyLabel}
        </Link>
      </div>

      <DataTable data={terms} columns={columns} searchKey="name" onBulkDelete={handleBulkDelete} />
    </>
  );
}
