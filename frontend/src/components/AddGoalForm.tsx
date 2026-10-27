import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { Plus, ChevronDown, ChevronUp, Calendar, FileText, Star, Image, Sparkles, Wallet } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AddGoalFormProps {
  categories: Category[];
  onAdd: (goal: { 
    title: string; 
    categoryId: string; 
    deadline?: string; 
    notes?: string; 
    priority?: number;
    imageUrl?: string;
    budget?: number;
  }) => void;
  onOpenManageCategories: () => void;
  onOpenInspiration: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ 
  categories, 
  onAdd, 
  onOpenManageCategories,
  onOpenInspiration 
}) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [budget, setBudget] = useState('');
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && categoryId) {
      onAdd({
        title: title.trim(),
        categoryId,
        deadline: deadline || undefined,
        notes: notes.trim() || undefined,
        priority,
        imageUrl: imageUrl.trim() || undefined,
        budget: budget ? Number(budget) : undefined
      });
      setTitle('');
      setDeadline('');
      setNotes('');
      setPriority(0);
      setImageUrl('');
      setBudget('');
      setShowExtras(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const IconComponent = selectedCategory ? (Icons as any)[selectedCategory.icon] : null;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Přidat nový cíl</h2>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            type="button" 
            onClick={onOpenInspiration} 
            className="btn btn-sm" 
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#B45309', border: '1px solid rgba(245, 158, 11, 0.3)' }}
          >
            <Sparkles size={14} /> Inspirace
          </button>
          <button type="button" onClick={onOpenManageCategories} className="btn-icon" style={{ fontSize: '0.85rem' }}>
            + Kategorie
          </button>
        </div>
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
            placeholder="Co chcete zažít nebo dokázat?"
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

        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="btn-icon extras-toggle"
            onClick={() => setShowExtras(!showExtras)}
            style={{ 
              fontSize: '0.85rem', 
              color: 'var(--text-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              marginBottom: showExtras ? '0.75rem' : 0
            }}
          >
            {showExtras ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showExtras ? 'Skrýt detaily' : 'Přidat termín, foto, rozpočet, poznámku…'}
          </button>

          {showExtras && (
            <div className="extras-panel" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '0.75rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-color)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div className="form-group">
                <label htmlFor="deadline" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Deadline
                </label>
                <input
                  id="deadline"
                  type="date"
                  className="input-field"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="budget" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Wallet size={14} /> Rozpočet (Kč)
                </label>
                <input
                  id="budget"
                  type="number"
                  min="0"
                  step="500"
                  className="input-field"
                  placeholder="Např. 35000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={14} /> Priorita
                </label>
                <button
                  type="button"
                  className={`btn ${priority ? 'btn-star-active' : 'btn-star'}`}
                  onClick={() => setPriority(priority ? 0 : 1)}
                  style={{ width: '100%', height: '42px' }}
                >
                  {priority ? '⭐ Prioritní cíl' : '☆ Normální'}
                </button>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="imageUrl" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Image size={14} /> Odkaz na fotografii (URL)
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  className="input-field"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="notes" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileText size={14} /> Poznámky
                </label>
                <textarea
                  id="notes"
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detaily, rozpočet, odkazy na weby…"
                  rows={2}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={!title.trim() || !categoryId}>
          <Plus size={20} />
          Uložit
        </button>
      </form>
    </div>
  );
};
