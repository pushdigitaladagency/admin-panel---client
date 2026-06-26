'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

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
  filterOptions,
  filterKey = 'status',
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  // Filter
  const filtered = useMemo(() => {
    let result = data;

    if (filterOptions && filterStatus !== '') {
      result = result.filter((row) => {
        const val = typeof filterKey === 'function' ? filterKey(row) : row[filterKey];
        const strVal = typeof val === 'boolean' ? (val ? 'Active' : 'Inactive') : String(val);
        return strVal.toLowerCase() === filterStatus.toLowerCase();
      });
    }

    if (!search.trim()) return result;
    const q = search.toLowerCase();
    return result.filter((row) => {
      const val = row[searchKey];
      return val && String(val).toLowerCase().includes(q);
    });
  }, [data, search, searchKey, filterOptions, filterStatus, filterKey]);

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
        <div className="data-table-toolbar" style={{ width: '100%', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="data-table-search" style={{ display: 'flex', gap: '10px', flex: 1 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '14px', maxWidth: '300px' }}
            />
            {filterOptions && (
              <div className="custom-filter-dropdown" ref={filterRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#e9ecef',
                    color: '#1e293b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <Filter size={16} style={{ color: '#475569' }} />
                  Status
                  {isFilterOpen ? <ChevronUp size={16} style={{ color: '#475569' }} /> : <ChevronDown size={16} style={{ color: '#475569' }} />}
                </button>
                
                {isFilterOpen && (
                  <div
                    className="custom-filter-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '6px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      minWidth: '180px',
                      maxHeight: '160px',
                      overflowY: 'auto',
                      zIndex: 50,
                      padding: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}
                  >
                    <div
                      onClick={() => {
                        setFilterStatus('');
                        setPage(1);
                        setIsFilterOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: filterStatus === '' ? '600' : '400',
                        backgroundColor: filterStatus === '' ? '#e2e8f0' : 'transparent',
                        color: filterStatus === '' ? '#1e293b' : '#334155',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (filterStatus !== '') e.target.style.backgroundColor = '#f1f5f9';
                      }}
                      onMouseLeave={(e) => {
                        if (filterStatus !== '') e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      All Statuses
                    </div>
                    {filterOptions.map((opt) => {
                      const val = typeof opt === 'object' ? opt.value : opt;
                      const label = typeof opt === 'object' ? opt.label : opt;
                      const isSelected = filterStatus === val;
                      return (
                        <div
                          key={val}
                          onClick={() => {
                            setFilterStatus(val);
                            setPage(1);
                            setIsFilterOpen(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: isSelected ? '600' : '400',
                            backgroundColor: isSelected ? '#e2e8f0' : 'transparent',
                            color: isSelected ? '#1e293b' : '#334155',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.target.style.backgroundColor = '#f1f5f9';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
