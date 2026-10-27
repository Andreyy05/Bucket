import React from 'react';
import type { Goal, Category } from '../types';
import * as Icons from 'lucide-react';
import { Star, MapPin, Calendar, Award, Sparkles, BookOpen } from 'lucide-react';

interface TimelineViewProps {
  goals: Goal[];
  categories: Category[];
  onOpenReflection: (goal: Goal) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ goals, categories, onOpenReflection }) => {
  const completedGoals = goals
    .filter(g => g.state === 'completed' && g.completedAt)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  if (completedGoals.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '1rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: 'var(--primary-color)'
        }}>
          <Sparkles size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Časová osa vašich úspěchů
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', fontSize: '0.9rem' }}>
          Zatím nemáte splněný žádný cíl. Jakmile si splníte svůj první sen a odškrtnete ho, objeví se zde v časové ose i s vaší osobní vzpomínkou!
        </p>
      </div>
    );
  }

  // Group by Year
  const groupedByYear: { [year: string]: Goal[] } = {};
  completedGoals.forEach(g => {
    const year = new Date(g.completedAt!).getFullYear().toString();
    if (!groupedByYear[year]) groupedByYear[year] = [];
    groupedByYear[year].push(g);
  });

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="timeline-container">
      {sortedYears.map(year => (
        <div key={year} className="timeline-year-group">
          <div className="timeline-year-badge">
            <Calendar size={15} /> {year}
          </div>

          <div className="timeline-items">
            {groupedByYear[year].map((goal) => {
              const category = categories.find(c => c.id === goal.categoryId);
              const IconComponent = category ? (Icons as any)[category.icon] : null;
              const completedDate = new Date(goal.completedAt!).toLocaleDateString('cs-CZ', {
                day: 'numeric',
                month: 'long'
              });

              return (
                <div key={goal.id} className="timeline-item card">
                  {/* Category icon node */}
                  <div
                    className="timeline-node"
                    style={{
                      backgroundColor: category ? category.color : 'var(--primary-color)'
                    }}
                  >
                    {IconComponent ? <IconComponent size={14} color="#FFF" /> : <Award size={14} color="#FFF" />}
                  </div>

                  <div className="timeline-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span className="timeline-date">{completedDate}</span>

                      {/* Stars */}
                      {goal.rating && (
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              size={14}
                              fill={star <= goal.rating! ? '#F59E0B' : 'none'}
                              color={star <= goal.rating! ? '#F59E0B' : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="timeline-goal-title">{goal.title}</h3>

                    {/* Location badge */}
                    {goal.location && (
                      <div className="timeline-location">
                        <MapPin size={13} /> {goal.location}
                      </div>
                    )}

                    {/* Cover photo if exists */}
                    {goal.imageUrl && (
                      <div className="timeline-image-wrap">
                        <img src={goal.imageUrl} alt={goal.title} className="timeline-image" loading="lazy" />
                      </div>
                    )}

                    {/* Reflection / Memory note */}
                    {goal.reflection ? (
                      <blockquote className="timeline-reflection">
                        „{goal.reflection}“
                      </blockquote>
                    ) : (
                      <button
                        className="btn btn-sm"
                        onClick={() => onOpenReflection(goal)}
                        style={{
                          marginTop: '0.5rem',
                          backgroundColor: 'var(--bg-color)',
                          color: 'var(--text-muted)',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem'
                        }}
                      >
                        <BookOpen size={12} /> Zapsat vzpomínku do deníku…
                      </button>
                    )}

                    {goal.reflection && (
                      <button
                        className="timeline-edit-reflection"
                        onClick={() => onOpenReflection(goal)}
                      >
                        Upravit vzpomínku
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
