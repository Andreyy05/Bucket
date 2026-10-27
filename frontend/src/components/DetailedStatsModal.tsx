import React from 'react';
import type { Goal, Category } from '../types';
import { X, Trophy, CheckCircle2, Clock, Star, Flame, BarChart3, Wallet, HeartHandshake } from 'lucide-react';
import * as Icons from 'lucide-react';

interface DetailedStatsModalProps {
  goals: Goal[];
  categories: Category[];
  onClose: () => void;
}

export const DetailedStatsModal: React.FC<DetailedStatsModalProps> = ({ goals, categories, onClose }) => {
  const total = goals.length;
  const completed = goals.filter(g => g.state === 'completed').length;
  const active = total - completed;
  const priorityCount = goals.filter(g => g.priority).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Subtasks stats
  const allSubtasks = goals.flatMap(g => g.subtasks || []);
  const completedSubtasks = allSubtasks.filter(s => s.completed).length;

  // Financial budget stats
  const totalBudget = goals.reduce((acc, g) => acc + (g.budget || 0), 0);
  const completedBudget = goals.filter(g => g.state === 'completed').reduce((acc, g) => acc + (g.budget || 0), 0);
  const activeBudget = totalBudget - completedBudget;

  // Memories / Reflections count
  const memoriesCount = goals.filter(g => g.reflection).length;

  // Category breakdown
  const categoryStats = categories.map(cat => {
    const catGoals = goals.filter(g => g.categoryId === cat.id);
    const catCompleted = catGoals.filter(g => g.state === 'completed').length;
    const catTotal = catGoals.length;
    const catRate = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    return {
      category: cat,
      total: catTotal,
      completed: catCompleted,
      rate: catRate
    };
  }).filter(stat => stat.total > 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px', width: '92%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={24} color="var(--primary-color)" /> Detailní přehled & statistiky
          </h2>
          <button className="btn-icon" onClick={onClose} aria-label="Zavřít">
            <X size={20} />
          </button>
        </div>

        {/* Highlight KPI grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1.5rem'
        }}>
          <div className="stat-card">
            <Trophy size={18} color="var(--primary-color)" />
            <div className="stat-num">{completionRate}%</div>
            <div className="stat-desc">Úspěšnost</div>
          </div>
          <div className="stat-card">
            <CheckCircle2 size={18} color="var(--success-color)" />
            <div className="stat-num">{completed}</div>
            <div className="stat-desc">Splněno</div>
          </div>
          <div className="stat-card">
            <Clock size={18} color="var(--text-muted)" />
            <div className="stat-num">{active}</div>
            <div className="stat-desc">Aktivních</div>
          </div>
          <div className="stat-card">
            <Star size={18} color="var(--warning-color)" />
            <div className="stat-num">{priorityCount}</div>
            <div className="stat-desc">Prioritních</div>
          </div>
          {allSubtasks.length > 0 && (
            <div className="stat-card">
              <Flame size={18} color="#EC4899" />
              <div className="stat-num">{completedSubtasks}/{allSubtasks.length}</div>
              <div className="stat-desc">Podúkolů</div>
            </div>
          )}
          {memoriesCount > 0 && (
            <div className="stat-card">
              <HeartHandshake size={18} color="#8B5CF6" />
              <div className="stat-num">{memoriesCount}</div>
              <div className="stat-desc">Vzpomínek</div>
            </div>
          )}
        </div>

        {/* Budget stats section (if any budgets defined) */}
        {totalBudget > 0 && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-color)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Wallet size={16} color="var(--primary-color)" /> Finanční rozpočet cílů
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Investováno do splněných snů:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--success-color)', marginTop: '0.2rem' }}>
                  {completedBudget.toLocaleString('cs-CZ')} Kč
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Plánovaný rozpočet na aktivní cíle:</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-color)', marginTop: '0.2rem' }}>
                  {activeBudget.toLocaleString('cs-CZ')} Kč
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category progress bars */}
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Pokrok podle kategorií
        </h3>

        {categoryStats.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1.5rem 0' }}>
            Zatím nemáte v žádné kategorii zadané cíle.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {categoryStats.map(({ category, total: catTotal, completed: catComp, rate }) => {
              const IconComponent = (Icons as any)[category.icon];
              return (
                <div key={category.id} style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-color)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, fontSize: '0.9rem', color: category.color }}>
                      {IconComponent && <IconComponent size={16} />}
                      {category.name}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <strong>{catComp}</strong> z <strong>{catTotal}</strong> ({rate}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${rate}%`,
                      height: '100%',
                      backgroundColor: category.color,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
