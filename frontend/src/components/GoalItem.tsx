import React, { useState } from 'react';
import type { Goal, Category, Subtask } from '../types';
import { 
  CheckCircle, 
  Circle, 
  Trash2, 
  Star, 
  Calendar, 
  FileText, 
  Edit3, 
  X, 
  Check, 
  ListChecks, 
  Plus, 
  CheckSquare, 
  Square,
  ChevronDown,
  ChevronUp,
  Wallet,
  BookOpen,
  MapPin
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { fireSuccessConfetti } from '../utils/confetti';

interface GoalItemProps {
  goal: Goal;
  category?: Category;
  categories: Category[];
  isBoardView?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onOpenReflection?: (goal: Goal) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({ 
  goal, 
  category, 
  categories, 
  isBoardView = false,
  onToggle, 
  onDelete, 
  onUpdate,
  onOpenReflection 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editCategoryId, setEditCategoryId] = useState(goal.categoryId);
  const [editDeadline, setEditDeadline] = useState(goal.deadline || '');
  const [editNotes, setEditNotes] = useState(goal.notes || '');
  const [editImageUrl, setEditImageUrl] = useState(goal.imageUrl || '');
  const [editBudget, setEditBudget] = useState(goal.budget ? goal.budget.toString() : '');

  // Subtasks state
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const subtasks = goal.subtasks || [];
  const completedSubtasksCount = subtasks.filter(s => s.completed).length;
  const subtasksPercent = subtasks.length > 0 ? Math.round((completedSubtasksCount / subtasks.length) * 100) : 0;

  const IconComponent = category ? (Icons as any)[category.icon] : null;

  const handleToggleGoal = () => {
    if (goal.state === 'active') {
      fireSuccessConfetti();
      // If marking as completed for first time, open reflection modal
      if (onOpenReflection && !goal.reflection) {
        setTimeout(() => {
          onOpenReflection(goal);
        }, 500);
      }
    }
    onToggle(goal.id);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdate(goal.id, {
      title: editTitle.trim(),
      categoryId: editCategoryId,
      deadline: editDeadline || null,
      notes: editNotes.trim(),
      imageUrl: editImageUrl.trim() || null,
      budget: editBudget ? Number(editBudget) : null
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(goal.title);
    setEditCategoryId(goal.categoryId);
    setEditDeadline(goal.deadline || '');
    setEditNotes(goal.notes || '');
    setEditImageUrl(goal.imageUrl || '');
    setEditBudget(goal.budget ? goal.budget.toString() : '');
    setIsEditing(false);
  };

  const handleTogglePriority = () => {
    onUpdate(goal.id, { priority: goal.priority ? 0 : 1 });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle.trim(),
      completed: false
    };

    onUpdate(goal.id, {
      subtasks: [...subtasks, newSubtask]
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = subtasks.map(s => {
      if (s.id === subtaskId) {
        return { ...s, completed: !s.completed };
      }
      return s;
    });

    const allDone = updated.length > 0 && updated.every(s => s.completed);
    if (allDone) {
      fireSuccessConfetti();
    }

    onUpdate(goal.id, { subtasks: updated });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = subtasks.filter(s => s.id !== subtaskId);
    onUpdate(goal.id, { subtasks: updated });
  };

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const formatted = date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (goal.state === 'completed') return formatted;
    if (diffDays < 0) return `⚠️ ${formatted} (po termínu!)`;
    if (diffDays === 0) return `🔥 ${formatted} (dnes!)`;
    if (diffDays <= 7) return `⏰ ${formatted} (za ${diffDays} dní)`;
    return formatted;
  };

  if (isEditing) {
    return (
      <div className="goal-item editing">
        <div className="edit-form">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <select
              className="input-field"
              value={editCategoryId}
              onChange={(e) => setEditCategoryId(e.target.value)}
              style={{ flex: '1' }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="date"
              className="input-field"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              style={{ flex: '1' }}
            />
            <input
              type="number"
              className="input-field"
              placeholder="Rozpočet (Kč)"
              value={editBudget}
              onChange={(e) => setEditBudget(e.target.value)}
              style={{ flex: '1', minWidth: '120px' }}
            />
          </div>
          <div className="form-group">
            <input
              type="url"
              className="input-field"
              placeholder="Odkaz na fotografii (URL)…"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
            />
          </div>
          <textarea
            className="input-field"
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Poznámky…"
            rows={2}
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-sm" onClick={handleCancelEdit} style={{ background: 'var(--border-color)', color: 'var(--text-main)' }}>
              <X size={14} /> Zrušit
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSaveEdit} disabled={!editTitle.trim()}>
              <Check size={14} /> Uložit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`goal-item ${isBoardView ? 'board-card' : ''} ${goal.state === 'completed' ? 'completed' : ''} ${goal.priority ? 'priority' : ''}`}>
      {/* Cover image in Vision Board mode */}
      {goal.imageUrl && (
        <div className="goal-cover-wrap">
          <img 
            src={goal.imageUrl} 
            alt={goal.title} 
            className="goal-cover-img" 
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
        <div className="goal-content">
          <button 
            className={`btn-icon ${goal.state === 'completed' ? 'btn-success' : ''}`}
            onClick={handleToggleGoal}
            aria-label={goal.state === 'completed' ? 'Označit jako nesplněné' : 'Označit jako splněné'}
          >
            {goal.state === 'completed' ? <CheckCircle size={22} /> : <Circle size={22} />}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="goal-title">{goal.title}</div>
            
            {/* Meta info row */}
            <div className="goal-meta">
              {goal.deadline && (
                <span className={`goal-deadline ${goal.state !== 'completed' && new Date(goal.deadline) < new Date() ? 'overdue' : ''}`}>
                  <Calendar size={12} />
                  {formatDeadline(goal.deadline)}
                </span>
              )}
              {goal.budget !== undefined && goal.budget !== null && goal.budget > 0 && (
                <span className="goal-meta-badge" title="Předpokládaný rozpočet">
                  <Wallet size={12} color="var(--primary-color)" /> {goal.budget.toLocaleString('cs-CZ')} Kč
                </span>
              )}
              {goal.notes && (
                <span className="goal-notes-indicator" title={goal.notes}>
                  <FileText size={12} /> Poznámka
                </span>
              )}
              {subtasks.length > 0 && (
                <span className={`goal-subtasks-badge ${completedSubtasksCount === subtasks.length ? 'all-done' : ''}`}>
                  <ListChecks size={12} /> {completedSubtasksCount}/{subtasks.length} ({subtasksPercent}%)
                </span>
              )}
              {goal.completedAt && goal.state === 'completed' && (
                <span className="goal-completed-date">
                  ✓ Splněno {new Date(goal.completedAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>

            {/* Reflection preview on card (if goal completed and reflection exists) */}
            {goal.state === 'completed' && (goal.reflection || goal.rating) && (
              <div className="goal-reflection-box" onClick={() => onOpenReflection && onOpenReflection(goal)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                  {goal.rating && (
                    <div style={{ display: 'flex', gap: '1px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={11} fill={s <= goal.rating! ? '#F59E0B' : 'none'} color="#F59E0B" />
                      ))}
                    </div>
                  )}
                  {goal.location && (
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <MapPin size={10} /> {goal.location}
                    </span>
                  )}
                </div>
                {goal.reflection && <p className="goal-reflection-text">„{goal.reflection}“</p>}
              </div>
            )}

            {/* Notes preview */}
            {goal.notes && (
              <div className="goal-notes-preview">{goal.notes}</div>
            )}
          </div>
        </div>

        <div className="goal-actions" style={{ alignItems: 'center' }}>
          {goal.state === 'completed' && onOpenReflection && (
            <button
              className="btn-icon"
              onClick={() => onOpenReflection(goal)}
              title={goal.reflection ? 'Zobrazit vzpomínku v deníku' : 'Zapsat vzpomínku do deníku'}
              style={{ color: goal.reflection ? '#8B5CF6' : 'var(--text-muted)' }}
            >
              <BookOpen size={17} />
            </button>
          )}
          <button
            className={`btn-icon btn-star-toggle ${goal.priority ? 'active' : ''}`}
            onClick={handleTogglePriority}
            aria-label={goal.priority ? 'Odebrat prioritu' : 'Nastavit jako prioritní'}
            title={goal.priority ? 'Prioritní' : 'Nastavit prioritu'}
          >
            <Star size={18} fill={goal.priority ? '#F59E0B' : 'none'} color={goal.priority ? '#F59E0B' : 'var(--text-muted)'} />
          </button>
          {category && (
            <span className="goal-category" style={{ 
              color: category.color, 
              backgroundColor: `${category.color}15`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {IconComponent && <IconComponent size={14} />}
              {category.name}
            </span>
          )}
          <button 
            className="btn-icon"
            onClick={() => setIsEditing(true)}
            aria-label="Upravit cíl"
            title="Upravit cíl"
            style={{ color: 'var(--text-muted)' }}
          >
            <Edit3 size={17} />
          </button>
          <button 
            className="btn-icon" 
            onClick={() => onDelete(goal.id)}
            aria-label="Smazat cíl"
            title="Smazat cíl"
            style={{ color: 'var(--danger-color)' }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Subtasks Progress Bar & Toggle Button */}
      <div style={{ width: '100%', marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          type="button"
          className="subtasks-toggle-btn"
          onClick={() => setShowSubtasks(!showSubtasks)}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ListChecks size={14} />
            {subtasks.length === 0 ? 'Přidat podúkoly' : `Podúkoly (${completedSubtasksCount}/${subtasks.length})`}
          </span>
          {showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {subtasks.length > 0 && !showSubtasks && (
          <div className="subtasks-mini-progress">
            <div className="subtasks-mini-fill" style={{ width: `${subtasksPercent}%` }} />
          </div>
        )}

        {/* Expanded Subtasks Panel */}
        {showSubtasks && (
          <div className="subtasks-panel">
            {subtasks.length > 0 && (
              <div className="subtasks-list">
                {subtasks.map(subtask => (
                  <div key={subtask.id} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                    <button
                      type="button"
                      className="subtask-checkbox"
                      onClick={() => handleToggleSubtask(subtask.id)}
                    >
                      {subtask.completed ? <CheckSquare size={16} color="var(--success-color)" /> : <Square size={16} color="var(--text-muted)" />}
                    </button>
                    <span className="subtask-title" onClick={() => handleToggleSubtask(subtask.id)}>
                      {subtask.title}
                    </span>
                    <button
                      type="button"
                      className="btn-icon btn-sm"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                      aria-label="Smazat podúkol"
                      style={{ padding: '0.2rem', color: 'var(--text-muted)' }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="add-subtask-form">
              <input
                type="text"
                className="input-field input-sm"
                placeholder="Nový krok…"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={!newSubtaskTitle.trim()}
              >
                <Plus size={14} /> Přidat
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
