import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AddGoalFormProps {
  categories: Category[];
  onAdd: (title: string, categoryId: string) => void;
  onOpenManageCategories: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ categories, onAdd, onOpenManageCategories }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      onAdd(title.trim(), categoryId);
      setTitle('');
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const IconComponent = selectedCategory ? (Icons as any)[selectedCategory.icon] : null;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Přidat nový cíl</h2>
        <button type="button" onClick={onOpenManageCategories} className="btn-icon" style={{ fontSize: '0.875rem' }}>
          + Nová kategorie
        </button>
      </div>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group" style={{ flex: '2' }}>
          <label htmlFor="title" className="form-label">Váš cíl (např. Dovolená na Bali)</label>
          <input
            id="title"
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Co chcete zažít?"
            required
          />
        </div>
        
        <div className="form-group" style={{ flex: '1' }}>
          <label htmlFor="category" className="form-label">Kategorie</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {IconComponent && (
              <IconComponent size={20} color={selectedCategory?.color} />
            )}
            <select
              id="category"
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={!title.trim() || !categoryId}>
          <Plus size={20} />
          Uložit
        </button>
      </form>
    </div>
  );
};
