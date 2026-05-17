import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '../types';
import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';

export const TargetFormView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        const cats = data.itemList || [];
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      const newGoal = {
        id: uuidv4(),
        title: title.trim(),
        categoryId,
        state: 'active',
        createdAt: Date.now(),
      };

      try {
        const response = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newGoal)
        });
        if (response.ok) {
          navigate('/');
        } else {
          console.error('Failed to create goal');
        }
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const IconComponent = selectedCategory ? (Icons as any)[selectedCategory.icon] : null;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Vytvořit nový cíl</h2>
        <button type="button" onClick={() => navigate('/category/create')} className="btn-icon" style={{ fontSize: '0.875rem' }}>
          + Nová kategorie
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div className="form-group">
          <label htmlFor="title" className="form-label" style={{ fontWeight: 600 }}>Váš cíl</label>
          <input
            id="title"
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Co chcete zažít? (např. Dovolená na Bali)"
            required
            style={{ padding: '1rem', fontSize: '1.1rem' }}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category" className="form-label" style={{ fontWeight: 600 }}>Kategorie</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ 
              width: 48, height: 48, 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: selectedCategory ? `${selectedCategory.color}20` : 'var(--bg-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {IconComponent && (
                <IconComponent size={24} color={selectedCategory?.color} />
              )}
            </div>
            <select
              id="category"
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              style={{ padding: '1rem', fontSize: '1.1rem', flex: 1 }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn" onClick={() => navigate('/')} style={{ padding: '1rem 2rem' }}>
            Zrušit
          </button>
          <button type="submit" className="btn btn-primary" disabled={!title.trim() || !categoryId} style={{ padding: '1rem 2rem' }}>
            <Plus size={20} />
            Uložit
          </button>
        </div>
      </form>
    </div>
  );
};
