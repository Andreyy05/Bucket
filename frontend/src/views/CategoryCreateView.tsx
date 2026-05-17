import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Icons from 'lucide-react';

const AVAILABLE_ICONS = ['Plane', 'Book', 'Star', 'Briefcase', 'Heart', 'MoreHorizontal', 'Sun', 'Moon', 'Map', 'Camera'];
const AVAILABLE_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'];

export const CategoryCreateView = () => {
  const navigate = useNavigate();
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
    
    const newCat = { id: uuidv4(), name: name.trim(), icon: selectedIcon, color: selectedColor };
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Nepodařilo se vytvořit kategorii.');
      }
      
      // Redirect back
      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Nepodařilo se vytvořit kategorii.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Vytvořit novou kategorii</h2>

      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="catName" className="form-label" style={{ fontWeight: 600 }}>Název kategorie</label>
          <input
            id="catName"
            type="text"
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Zadejte název kategorie (např. Vzdělávání)"
            required
            style={{ padding: '1rem', fontSize: '1.1rem' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Ikona</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {AVAILABLE_ICONS.map(iconName => {
              const IconComponent = (Icons as any)[iconName];
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedIcon === iconName ? selectedColor : 'var(--border-color)'}`,
                    backgroundColor: selectedIcon === iconName ? `${selectedColor}15` : 'var(--bg-color)',
                    cursor: 'pointer',
                    color: selectedIcon === iconName ? selectedColor : 'var(--text-muted)',
                    transition: 'var(--transition)'
                  }}
                >
                  {IconComponent && <IconComponent size={28} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Barva</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {AVAILABLE_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: `4px solid ${selectedColor === color ? 'var(--text-main)' : 'transparent'}`,
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: selectedColor === color ? `0 0 0 2px ${color}50` : 'none',
                  transition: 'var(--transition)'
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn" onClick={() => navigate(-1)} style={{ padding: '1rem 2rem' }}>
            Zrušit
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ backgroundColor: selectedColor, padding: '1rem 2rem' }}
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting ? 'Ukládám...' : 'ULOŽIT'}
          </button>
        </div>
      </form>
    </div>
  );
};
