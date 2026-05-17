import React from 'react';
import type { Goal, Category } from '../types';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface TargetCardProps {
  goal: Goal;
  category?: Category;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({ goal, category, onToggle, onDelete }) => {
  const IconComponent = category ? (Icons as any)[category.icon] : null;

  return (
    <div className={`goal-item ${goal.state === 'completed' ? 'completed' : ''}`}>
      <div className="goal-content">
        <button 
          className={`btn-icon ${goal.state === 'completed' ? 'btn-success' : ''}`}
          onClick={() => onToggle(goal.id)}
          aria-label={goal.state === 'completed' ? 'Označit jako nesplněné' : 'Označit jako splněné'}
        >
          {goal.state === 'completed' ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
        <div>
          <div className="goal-title">{goal.title}</div>
        </div>
      </div>
      <div className="goal-actions" style={{ alignItems: 'center' }}>
        {category && (
          <span className="goal-category" style={{ 
            color: category.color, 
            backgroundColor: `${category.color}15`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {IconComponent && <IconComponent size={14} />}
            {category.name}
          </span>
        )}
        <button 
          className="btn-icon" 
          onClick={() => onDelete(goal.id)}
          aria-label="Smazat cíl"
          style={{ color: 'var(--danger-color)' }}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
