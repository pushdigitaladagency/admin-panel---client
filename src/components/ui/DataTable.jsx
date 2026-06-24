'use client';

import { useState, useMemo } from 'react';

/**
 * Reusable DataTable with search, sort, pagination, and bulk selection.
 * 
 * Props:
 *   data        — array of row objects
 *   columns     — array of { header, accessorKey?, render? }
 *   searchKey   — key in data to search on (default: 'name')
 *   perPage     — rows per page (default: 10)
 *   onBulkDelete — callback with selected IDs
 *   idKey       — unique ID key (default: 'id')
 */
export default function DataTable({
  data = [],
  columns = [],
  searchKey = 'name',
  perPage = 10,
  onBulkDelete,
  idKey = 'id',
}) {
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  // Filter
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      const val = row[searchKey];
      return val && String(val).toLowerCase().includes(q);
    });
  }, [data, search, searchKey]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortCol] ?? '';
      const bVal = b[sortCol] ?? '';
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortCol, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  // Handlers
  function handleSort(col) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  }

  function toggleSelect(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selected.length === paginated.length) {
      setSelected([]);
    } else {
      setSelected(paginated.map((r) => r[idKey]));
    }
  }

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="card-header">
        <div className="data-table-toolbar" style={{ width: '100%' }}>
          <div className="data-table-search">
            <input
              type="text"
              className="form-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '14px' }}
            />
          </div>

          <div className="data-table-actions">
            {onBulkDelete && selected.length > 0 && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  onBulkDelete(selected);
                  setSelected([]);
                }}
              >
                Delete ({selected.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {onBulkDelete && (
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    className="data-table-checkbox"
                    checked={
                      paginated.length > 0 &&
                      selected.length === paginated.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={sortCol === col.accessorKey ? 'sorted' : ''}
                  onClick={() => col.accessorKey && handleSort(col.accessorKey)}
                >
                  {col.header}
                  {sortCol === col.accessorKey && (
                    <span className="sort-icon">
                      {sortDir === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onBulkDelete ? 1 : 0)}
                  className="data-table-empty"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row[idKey]}
                  className={selected.includes(row[idKey]) ? 'selected' : ''}
                >
                  {onBulkDelete && (
                    <td>
                      <input
                        type="checkbox"
                        className="data-table-checkbox"
                        checked={selected.includes(row[idKey])}
                        onChange={() => toggleSelect(row[idKey])}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.header}>
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                        ? row[col.accessorKey]
                        : ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card-footer">
          <div className="pagination" style={{ width: '100%' }}>
            <div className="pagination-info">
              Showing {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, sorted.length)} of {sorted.length}
            </div>
            <div className="pagination-buttons">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
                )
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="pagination-btn" style={{ cursor: 'default', border: 'none' }}>
                        …
                      </span>
                    )}
                    <button
                      className={`pagination-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
