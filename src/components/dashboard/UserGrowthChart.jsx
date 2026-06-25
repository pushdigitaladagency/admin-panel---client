'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, ChevronDown, SlidersHorizontal } from 'lucide-react';

const filterOptions = [
  'Last 6 months',
  'Last 12 months',
  'This year',
  'Last year',
  'Last 30 days',
  'Last 7 days',
  'This month'
];

export function UserGrowthChart({ data = [], loading = false }) {                                                                                                                                                                                                                                                                                          
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Last 6 months');
  const [isChartVisible, setIsChartVisible] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter data based on selection
  let chartData = data || [];
  if (selectedFilter === 'Last 6 months') {
    chartData = chartData.slice(-6);
  } else if (selectedFilter === 'Last 12 months') {
    chartData = chartData.slice(-12);
  } else if (selectedFilter === 'This year') {
    const currentYear = new Date().getFullYear().toString();
    chartData = chartData.filter(d => d.key && d.key.startsWith(currentYear));
  } else if (selectedFilter === 'Last year') {
    const lastYear = (new Date().getFullYear() - 1).toString();
    chartData = chartData.filter(d => d.key && d.key.startsWith(lastYear));
  } else if (selectedFilter === 'Last 30 days' || selectedFilter === 'This month') {
    chartData = chartData.slice(-1);
  } else if (selectedFilter === 'Last 7 days') {
    chartData = chartData.slice(-1);
  }

  // Ensure we have at least 2 points to draw a line in recharts
  if (chartData.length === 1) {
    // Duplicate the single point so it draws a flat line
    chartData = [{ ...chartData[0], name: `Start ${chartData[0].name}` }, chartData[0]];
  }

  const maxVal = chartData.reduce((max, item) => Math.max(max, item.users || 0), 0);
  const chartDomain = [0, maxVal > 0 ? Math.ceil(maxVal * 1.1) : 10];

  return (
    <div className="card mb-6" style={{ background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', position: 'relative' }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 0 24px', borderBottom: 'none', paddingBottom: isChartVisible ? '0' : '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-surface-hover)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={18} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>User Growth</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }} ref={dropdownRef}>
          <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--color-surface-hover)', color: '#6366f1', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
            {selectedFilter}
          </button>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}
          >
            <SlidersHorizontal size={16} />
            Filter
            <ChevronDown size={16} style={{ transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          <button 
            onClick={() => setIsChartVisible(!isChartVisible)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={20} style={{ transform: isChartVisible ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
 
          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: '0',
              width: '200px',
              background: 'var(--color-bg-alt)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid var(--color-border)',
              zIndex: 10,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {filterOptions.map((option) => {
                const isActive = option === selectedFilter;
                return (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      background: isActive ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                      color: isActive ? 'var(--color-text-muted)' : 'var(--color-text-muted)',
                      border: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--color-surface-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'var(--color-bg-alt)';
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
 
      {isChartVisible && (
        <div style={{ padding: '24px', width: '100%', height: 350, position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(2px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              borderRadius: '0 0 12px 12px'
            }}>
              <span style={{ color: '#6366f1', fontWeight: 600 }}>Loading chart data...</span>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text)', fontSize: 13, fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text)', fontSize: 13, fontWeight: 500 }}
                tickCount={6}
                domain={chartDomain}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--color-bg-alt)', color: 'var(--color-text)' }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#6366f1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
