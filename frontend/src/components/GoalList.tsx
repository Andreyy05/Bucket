import React from 'react';
import type { Goal, Category } from '../types';
import { GoalItem } from './GoalItem';
import { Compass } from 'lucide-react';

interface GoalListProps {
  goals: Goal[];
  categories: Category[];
  viewMode?: 'list' | 'board';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onOpenReflection?: (goal: Goal) => void;
}

export const GoalList: React.FC<GoalListProps> = ({ 
  goals, 
  categories, 
  viewMode = 'list',
  onToggle, 
  onDelete, 
  onUpdate,
  onOpenReflection
}) => {
  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <Compass size={48} />
        <p>Žádné cíle neodpovídají zadaným kritériím.</p>
      </div>
    );
  }

  return (
    <div className={`goal-list ${viewMode === 'board' ? 'board-view' : ''}`}>
      {goals.map(goal => {
        const category = categories.find(c => c.id === goal.categoryId);
        return (
          <GoalItem 
            key={goal.id} 
            goal={goal}
            category={category}
            categories={categories}
            isBoardView={viewMode === 'board'}
            onToggle={onToggle} 
            onDelete={onDelete} 
            onUpdate={onUpdate}
            onOpenReflection={onOpenReflection}
          />
        );
      })}
    </div>
  );
};
