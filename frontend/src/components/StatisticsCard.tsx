import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface StatisticsCardProps {
  total: number;
  completed: number;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ total, completed }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const active = total - completed;

  // SVG parameters
  const size = 220;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Calculate dash offset based on percentage
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ position: 'relative', width: size, height: size, marginBottom: '1.5rem' }}>
        {/* Background Circle (Active - Orange) */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#FDBA74" /* Orange lighter */
            strokeWidth={strokeWidth}
          />
          {/* Foreground Circle (Completed - Green) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--success-color)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--success-color)'
        }}>
          {percentage}%
        </div>
      </div>

      <div style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem' }}>
        Splněno {completed} z {total} cílů
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        width: '100%', 
        justifyContent: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <span>Aktivní: {active}</span>
          <Circle size={20} color="#F97316" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <span>Splněno: {completed}</span>
          <CheckCircle size={20} color="var(--success-color)" />
        </div>
      </div>
    </div>
  );
};
