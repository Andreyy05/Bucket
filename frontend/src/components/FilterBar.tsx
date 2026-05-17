import React from 'react';
import type { Category } from '../types';

interface FilterBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  selectedCategoryId, 
  onSelect 
}) => {
  return (
    <div className="category-filter">
      <button
        className={`filter-btn ${selectedCategoryId === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
        style={{
          borderColor: selectedCategoryId === null ? 'var(--primary-color)' : 'var(--border-color)',
        }}
      >
        Všechny
      </button>
      
      {categories.map(cat => {
        const isActive = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            className={`filter-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
            style={{
              borderColor: isActive ? cat.color : 'var(--border-color)',
              backgroundColor: isActive ? cat.color : 'var(--card-bg)',
              color: isActive ? '#fff' : 'var(--text-muted)'
            }}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
