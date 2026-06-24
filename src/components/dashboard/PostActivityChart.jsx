'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Label } from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';

const postActivityData = [
  { name: 'Jan 2026', news: 2, events: 1, pressReleases: 2 },
  { name: 'Feb 2026', news: 1, events: 0, pressReleases: 1 },
  { name: 'Mar 2026', news: 0, events: 1, pressReleases: 1 },
  { name: 'Apr 2026', news: 0, events: 0, pressReleases: 1 },
  { name: 'May 2026', news: 1, events: 0, pressReleases: 0 },
  { name: 'Jun 2026', news: 3, events: 1, pressReleases: 4 },
];

export function PostActivityChart() {
  const [isChartVisible, setIsChartVisible] = useState(true);
  const [hasBorder, setHasBorder] = useState(true);

  return (
    <div 
      className="card mb-6" 
      onClick={() => setHasBorder(!hasBorder)}
      style={{ 
        background: '#ffffff', 
        border: hasBorder ? '1px solid var(--color-border)' : 'none', 
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        outline: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 24px 16px 24px', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#dcfce7', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={18} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Post Activity</h3>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></span>
            News
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#06b6d4' }}></span>
            Events
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569', fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></span>
            Press Releases
          </div>
        </div>
      )}

      {/* Chart container */}
      {isChartVisible && (
        <div style={{ padding: '24px 24px 24px 12px', width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={postActivityData} margin={{ top: 10, right: 10, left: 15, bottom: 10 }} style={{ outline: 'none' }}>
              {/* Grid removed */}
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} 
                dy={10}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              >
                <Label 
                  value="Number of Posts" 
                  angle={-90} 
                  position="left"
                  offset={0}
                  style={{ textAnchor: 'middle', fill: '#0f172a', fontWeight: 700, fontSize: 13 }}
                />
              </YAxis>
              
              <Tooltip 
                cursor={false}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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
