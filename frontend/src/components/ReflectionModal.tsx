import React, { useState } from 'react';
import type { Goal } from '../types';
import { X, Star, MapPin, BookOpen, Check, Award } from 'lucide-react';

interface ReflectionModalProps {
  goal: Goal;
  onSave: (goalId: string, updates: { rating?: number | null; reflection?: string; location?: string }) => void;
  onClose: () => void;
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({ goal, onSave, onClose }) => {
  const [rating, setRating] = useState<number>(goal.rating || 5);
  const [location, setLocation] = useState(goal.location || '');
  const [reflection, setReflection] = useState(goal.reflection || '');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(goal.id, {
      rating,
      location: location.trim() || undefined,
      reflection: reflection.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', width: '92%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success-color)'
            }}>
              <Award size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Deník vzpomínek</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zaznamenejte si zážitek ze splnění</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {/* Goal Title Display */}
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--bg-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          borderLeft: '3px solid var(--success-color)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Splněný cíl
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.15rem' }}>
            {goal.title}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="form-group" style={{ marginBottom: '1.25rem', alignItems: 'center' }}>
            <label className="form-label" style={{ marginBottom: '0.35rem' }}>
              Jaký to byl zážitek?
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = hoveredStar !== null ? star <= hoveredStar : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <Star
                      size={28}
                      fill={filled ? '#F59E0B' : 'none'}
                      color={filled ? '#F59E0B' : 'var(--text-muted)'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div className="form-group" style={{ marginBottom: '1.15rem' }}>
            <label htmlFor="location" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={15} color="var(--primary-color)" /> Kde jste cíl splnili?
            </label>
            <input
              id="location"
              type="text"
              className="input-field"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Např. Řím, Itálie nebo Doma v obýváku…"
            />
          </div>

          {/* Reflection */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="reflection" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={15} color="var(--primary-color)" /> Vaše osobní vzpomínka & reflexe
            </label>
            <textarea
              id="reflection"
              className="input-field"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Jaké to bylo? Jaké pocity jste zažívali? Na co nikdy nezapomenete?…"
              rows={4}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-sm" onClick={onClose} style={{ background: 'var(--border-color)', color: 'var(--text-main)' }}>
              Přeskočit
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              <Check size={16} /> Uložit do deníku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
