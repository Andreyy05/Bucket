import React, { useState } from 'react';
import type { Category, Goal } from '../types';
import * as Icons from 'lucide-react';
import { Trash2, Plus, X, AlertCircle } from 'lucide-react';

const AVAILABLE_ICONS = ['Plane', 'Book', 'Star', 'Briefcase', 'Heart', 'MoreHorizontal', 'Sun', 'Moon', 'Map', 'Camera', 'Compass', 'Trophy', 'Music', 'Smile'];
const AVAILABLE_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1', '#6B7280'];

interface ManageCategoriesProps {
  categories: Category[];
  goals: Goal[];
  onAdd: (name: string, icon: string, color: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({ 
  categories, 
  goals, 
  onAdd, 
  onDelete, 
  onClose 
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onAdd(name.trim(), selectedIcon, selectedColor);
      setName('');
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se vytvořit kategorii.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    const goalsInCat = goals.filter(g => g.categoryId === catId).length;
    if (goalsInCat > 0) {
      setError(`Kategorii nelze smazat, protože obsahuje ${goalsInCat} cílů. Nejprve cíle přesuňte nebo smažte.`);
      return;
    }

    if (!window.confirm('Opravdu chcete tuto kategorii smazat?')) return;

    setDeletingId(catId);
    setError('');
    try {
      await onDelete(catId);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se smazat kategorii.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="card modal-content" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Správa kategorií</h2>
          <button onClick={onClose} className="btn-icon" aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger-color)',
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Existing Categories List */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Existující kategorie ({categories.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }}>
            {categories.map(cat => {
              const IconComponent = (Icons as any)[cat.icon];
              const goalsCount = goals.filter(g => g.categoryId === cat.id).length;

              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {IconComponent && <IconComponent size={14} />}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      ({goalsCount} {goalsCount === 1 ? 'cíl' : goalsCount >= 2 && goalsCount <= 4 ? 'cíle' : 'cílů'})
                    </span>
                  </div>

                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={deletingId === cat.id}
                    title={goalsCount > 0 ? 'Nelze smazat (obsahuje cíle)' : 'Smazat kategorii'}
                    style={{
                      color: goalsCount > 0 ? 'var(--text-muted)' : 'var(--danger-color)',
                      opacity: goalsCount > 0 ? 0.4 : 1,
                      cursor: goalsCount > 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Category Section */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Přidat novou kategorii
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="catName" className="form-label">Název kategorie</label>
              <input
                id="catName"
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Např. Zdraví & Sport"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Vybrat ikonu</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {AVAILABLE_ICONS.map(iconName => {
                  const IconComponent = (Icons as any)[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${selectedIcon === iconName ? selectedColor : 'transparent'}`,
                        backgroundColor: selectedIcon === iconName ? `${selectedColor}20` : 'var(--bg-color)',
                        cursor: 'pointer',
                        color: selectedIcon === iconName ? selectedColor : 'var(--text-muted)'
                      }}
                    >
                      {IconComponent && <IconComponent size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Vybrat barvu</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {AVAILABLE_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: `3px solid ${selectedColor === color ? 'var(--text-main)' : 'transparent'}`,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', backgroundColor: selectedColor }}
              disabled={!name.trim() || isSubmitting}
            >
              <Plus size={16} /> {isSubmitting ? 'Ukládám…' : 'Vytvořit kategorii'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
