import React, { useState } from 'react';
import type { Category } from '../types';
import { INSPIRATION_IDEAS, type IdeaItem } from '../data/inspirationIdeas';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface InspirationModalProps {
  categories: Category[];
  onAddGoal: (goal: {
    title: string;
    categoryId: string;
    notes?: string;
    imageUrl?: string;
    subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  }) => Promise<void>;
  onClose: () => void;
}

export const InspirationModal: React.FC<InspirationModalProps> = ({ categories, onAddGoal, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const availableCategories = ['all', ...Array.from(new Set(INSPIRATION_IDEAS.map(i => i.categoryName)))];

  const filteredIdeas = selectedCategory === 'all'
    ? INSPIRATION_IDEAS
    : INSPIRATION_IDEAS.filter(i => i.categoryName === selectedCategory);

  const handleAddIdea = async (idea: IdeaItem) => {
    // Find matching category by name or fallback to first category
    const matchedCategory = categories.find(
      c => c.name.toLowerCase() === idea.categoryName.toLowerCase()
    ) || categories[0];

    if (!matchedCategory) return;

    setLoadingId(idea.id);
    try {
      await onAddGoal({
        title: idea.title,
        categoryId: matchedCategory.id,
        notes: idea.notes,
        imageUrl: idea.imageUrl,
        subtasks: idea.subtasks?.map((title, idx) => ({
          id: `${Date.now()}-${idx}`,
          title,
          completed: false
        }))
      });
      setAddedIds(prev => new Set(prev).add(idea.id));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '94%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={22} color="#F59E0B" /> Knihovna inspirace
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Vyberte si ze skvělých životních snů a přidejte je do svého Bucket listu jedním klikem.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {availableCategories.map(cat => (
            <button
              key={cat}
              className={`status-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Všechny nápady' : cat}
            </button>
          ))}
        </div>

        {/* Grid of ideas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingRight: '0.25rem'
        }}>
          {filteredIdeas.map(idea => {
            const isAdded = addedIds.has(idea.id);
            const isLoading = loadingId === idea.id;

            return (
              <div
                key={idea.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-color)',
                  overflow: 'hidden',
                  transition: 'var(--transition)'
                }}
              >
                {idea.imageUrl && (
                  <div style={{ height: '130px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={idea.imageUrl}
                      alt={idea.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <span style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {idea.categoryName}
                    </span>
                  </div>
                )}

                <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                    {idea.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flex: 1 }}>
                    {idea.notes}
                  </p>

                  {idea.subtasks && idea.subtasks.length > 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                      📋 <em>{idea.subtasks.length} připravených kroků</em>
                    </div>
                  )}

                  <button
                    className={`btn btn-sm ${isAdded ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddIdea(idea)}
                    disabled={isAdded || isLoading}
                    style={{ width: '100%' }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} /> Přidáno do Bucket listu
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> {isLoading ? 'Přidávám…' : 'Přidat do mých cílů'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
