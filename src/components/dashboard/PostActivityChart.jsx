'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';

export function PostActivityChart({ data = [], loading = false }) {
  const [isChartVisible, setIsChartVisible] = useState(true);
  const [hasBorder, setHasBorder] = useState(true);

  const chartData = (data || []).slice(-6);

  const maxVal = chartData.reduce((max, item) => {
    return Math.max(max, item.news || 0, item.events || 0, item.pressReleases || 0);
  }, 0);
  
  const yMax = maxVal > 0 ? Math.ceil(maxVal * 1.1) : 10;
  const tickStep = Math.max(1, Math.ceil(yMax / 5));
  const yTicks = Array.from({ length: 6 }, (_, i) => i * tickStep);
  const yDomain = [0, yTicks[5]];

  return (
    <div 
      className="card mb-6" 
      onClick={() => setHasBorder(!hasBorder)}
      style={{ 
        background: 'var(--color-bg-alt)', 
        border: hasBorder ? '1px solid var(--color-border)' : 'none', 
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        height: isChartVisible ? '100%' : 'auto',
        alignSelf: isChartVisible ? 'stretch' : 'start',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isChartVisible ? '24px 24px 16px 24px' : '24px', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={18} />
          </div>
          <h3 style={{  fontsize: 'clamp(10px, 2vw, 1.25rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Post Activity</h3>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsChartVisible(!isChartVisible);
          }}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={20} style={{ transform: isChartVisible ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Legend - positioned below header */}
      {isChartVisible && (
        <div style={{ display: 'flex', gap: '24px', padding: '0 24px 16px 24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></span>
            News
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#06b6d4' }}></span>
            Events
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></span>
            Press Releases
          </div>
        </div>
      )}

      {/* Chart container */}
      {isChartVisible && (
        <div style={{ padding: '24px 24px 24px 12px', width: '100%', height: 350, position: 'relative' }}>
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
              <span style={{ color: '#22c55e', fontWeight: 600 }}>Loading chart data...</span>
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 15, bottom: 10 }} style={{ outline: 'none' }}>
              {/* Grid removed */}
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500 }} 
                dy={10}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-text-muted)', fontSize: 13, fontWeight: 500 }}
                domain={yDomain}
                ticks={yTicks}
              >
                <Label 
                  value="Number of Posts" 
                  angle={-90} 
                  position="left"
                  offset={0}
                  style={{ textAnchor: 'middle', fill: 'var(--color-text)', fontWeight: 700, fontSize: 13 }}
                />
              </YAxis>
              
              <Tooltip 
                cursor={false}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--color-bg-alt)', color: 'var(--color-text)' }}
                formatter={(value, name) => {
                  const displayName = 
                    name === 'news' ? 'News' :
                    name === 'events' ? 'Events' :
                    name === 'pressReleases' ? 'Press Releases' : name;
                  return [value, displayName];
                }}
              />
              
              {/* Grouped (side-by-side) bars with 3 different colors, top rounded corners, and increased size */}
              <Bar dataKey="news" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} style={{ outline: 'none' }} />
              <Bar dataKey="events" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={32} style={{ outline: 'none' }} />
              <Bar dataKey="pressReleases" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} style={{ outline: 'none' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
