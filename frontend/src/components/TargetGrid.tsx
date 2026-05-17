import React from 'react';
import type { Goal, Category } from '../types';
import { TargetCard } from './TargetCard';
import { Compass } from 'lucide-react';

interface TargetGridProps {
  goals: Goal[];
  categories: Category[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TargetGrid: React.FC<TargetGridProps> = ({ goals, categories, onToggle, onDelete }) => {
  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <Compass size={48} />
        <p>Zatím tu nemáte žádné cíle. Přidejte si svůj první sen!</p>
      </div>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => {
    if (a.state === b.state) {
      return b.createdAt - a.createdAt;
    }
    return a.state === 'completed' ? 1 : -1;
  });

  return (
    <div className="goal-list">
      {sortedGoals.map(goal => {
        const category = categories.find(c => c.id === goal.categoryId);
        return (
          <TargetCard 
            key={goal.id} 
            goal={goal}
            category={category}
            onToggle={onToggle} 
            onDelete={onDelete} 
          />
        );
      })}
    </div>
  );
};
