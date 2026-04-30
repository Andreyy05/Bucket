import React, { useState } from 'react';
import * as Icons from 'lucide-react';

const AVAILABLE_ICONS = ['Plane', 'Book', 'Star', 'Briefcase', 'Heart', 'MoreHorizontal', 'Sun', 'Moon', 'Map', 'Camera'];
const AVAILABLE_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];

interface ManageCategoriesProps {
  onAdd: (name: string, icon: string, color: string) => Promise<void>;
  onClose: () => void;
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await onAdd(name.trim(), selectedIcon, selectedColor);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se vytvořit kategorii.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal-content" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Vytvořit novou kategorii</h2>
          <button onClick={onClose} className="btn-icon" aria-label="Zavřít">
            <Icons.X size={24} />
          </button>
        </div>

        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="catName" className="form-label">Název nové kategorie</label>
            <input
              id="catName"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Zadejte název kategorie (např. Vzdělávání)"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Vybrat ikonu</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {AVAILABLE_ICONS.map(iconName => {
                const IconComponent = (Icons as any)[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selectedIcon === iconName ? selectedColor : 'transparent'}`,
                      backgroundColor: selectedIcon === iconName ? `${selectedColor}20` : 'var(--bg-color)',
                      cursor: 'pointer',
                      color: selectedIcon === iconName ? selectedColor : 'var(--text-muted)'
                    }}
                  >
                    {IconComponent && <IconComponent size={24} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Vybrat barvu</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {AVAILABLE_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: `3px solid ${selectedColor === color ? 'var(--text-main)' : 'transparent'}`,
                    cursor: 'pointer',
                    outline: 'none'
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
            {isSubmitting ? 'Ukládám...' : 'ULOŽIT'}
          </button>
        </form>
      </div>
    </div>
  );
};
