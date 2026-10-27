import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Goal, Category } from './types';
import { AddGoalForm } from './components/AddGoalForm';
import { GoalList } from './components/GoalList';
import { ProgressChart } from './components/ProgressChart';
import { CategoryFilter } from './components/CategoryFilter';
import { ManageCategories } from './components/ManageCategories';
import { BackupModal } from './components/BackupModal';
import { DetailedStatsModal } from './components/DetailedStatsModal';
import { InspirationModal } from './components/InspirationModal';
import { ReflectionModal } from './components/ReflectionModal';
import { TimelineView } from './components/TimelineView';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  CheckCircle, 
  Clock, 
  Sun, 
  Moon, 
  Database, 
  BarChart2,
  Sparkles,
  LayoutGrid,
  List,
  Milestone,
  Printer
} from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'completed' | 'priority';
type SortOption = 'smart' | 'deadline' | 'newest' | 'alphabetical';
type ViewMode = 'list' | 'board' | 'timeline';

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('smart');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('bucket_view_mode') as ViewMode) || 'list';
  });
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isDetailedStatsOpen, setIsDetailedStatsOpen] = useState(false);
  const [isInspirationOpen, setIsInspirationOpen] = useState(false);
  const [reflectionGoal, setReflectionGoal] = useState<Goal | null>(null);

  // Dark mode state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('bucket_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bucket_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleToggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('bucket_view_mode', mode);
  };

  const fetchData = useCallback(async () => {
    try {
      const [goalsRes, catRes] = await Promise.all([
        fetch('/api/goals'),
        fetch('/api/categories')
      ]);
      if (!goalsRes.ok || !catRes.ok) throw new Error('Network response was not ok');
      
      const goalsData = await goalsRes.json();
      const catData = await catRes.json();
      
      setGoals(goalsData.itemList || []);
      setCategories(catData.itemList || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddGoal = async (newGoalData: {
    title: string;
    categoryId: string;
    deadline?: string;
    notes?: string;
    priority?: number;
    imageUrl?: string;
    budget?: number;
    subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  }) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoalData)
      });
      if (response.ok) {
        const createdGoal = await response.json();
        setGoals((prev) => [createdGoal, ...prev]);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdateGoal = async (id: string, updates: Partial<Goal>) => {
    const originalGoal = goals.find(g => g.id === id);
    if (!originalGoal) return;

    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );

    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const updated = await response.json();
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      } else {
        throw new Error('Chyba při ukládání');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      // Revert upon failure
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? originalGoal : g))
      );
    }
  };

  const handleToggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newState = goal.state === 'active' ? 'completed' : 'active';
    await handleUpdateGoal(id, { state: newState });
  };

  const handleDeleteGoal = async (id: string) => {
    const previousGoals = [...goals];
    setGoals((prev) => prev.filter(g => g.id !== id));

    try {
      await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      setGoals(previousGoals);
    }
  };

  const handleAddCategory = async (name: string, icon: string, color: string) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, icon, color })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Nepodařilo se vytvořit kategorii');
    }

    const createdCat = await response.json();
    setCategories(prev => [...prev, createdCat]);
  };

  const handleDeleteCategory = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Nepodařilo se smazat kategorii');
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    if (filterCategoryId === id) {
      setFilterCategoryId(null);
    }
  };

  // Filter and sort logic
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Category filter
        if (filterCategoryId && goal.categoryId !== filterCategoryId) {
          return false;
        }

        // Status filter
        if (statusFilter === 'active' && goal.state !== 'active') return false;
        if (statusFilter === 'completed' && goal.state !== 'completed') return false;
        if (statusFilter === 'priority' && !goal.priority) return false;

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchNotes = (goal.notes || '').toLowerCase().includes(query);
          const matchLocation = (goal.location || '').toLowerCase().includes(query);
          const matchSubtasks = (goal.subtasks || []).some(s => s.title.toLowerCase().includes(query));
          return matchTitle || matchNotes || matchLocation || matchSubtasks;
        }

        return true;
      })
      .sort((a, b) => {
        // Active goals always on top of completed goals
        if (a.state !== b.state) {
          return a.state === 'completed' ? 1 : -1;
        }

        if (sortBy === 'smart') {
          // Priority first, then newest
          if ((b.priority || 0) !== (a.priority || 0)) {
            return (b.priority || 0) - (a.priority || 0);
          }
          return b.createdAt - a.createdAt;
        }

        if (sortBy === 'deadline') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }

        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }

        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title, 'cs');
        }

        return 0;
      });
  }, [goals, filterCategoryId, statusFilter, searchQuery, sortBy]);

  const completedCount = goals.filter(g => g.state === 'completed').length;
  const activeCount = goals.length - completedCount;
  const priorityCount = goals.filter(g => g.priority && g.state === 'active').length;

  return (
    <div className="container">
      {/* Top Navigation Bar with Quick Actions */}
      <div className="top-nav no-print">
        <div className="nav-title-wrap">
          <span className="brand-logo">🪣</span>
          <div>
            <h1 className="brand-title">Bucket</h1>
            <p className="brand-subtitle">Vaše životní sny a cíle na jednom místě.</p>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="btn-icon nav-action-btn"
            onClick={() => setIsInspirationOpen(true)}
            title="Knihovna nápadů & inspirace"
            aria-label="Inspirace"
          >
            <Sparkles size={18} color="#F59E0B" />
            <span className="nav-btn-label">Inspirace</span>
          </button>

          <button
            className="btn-icon nav-action-btn"
            onClick={() => setIsDetailedStatsOpen(true)}
            title="Detailní statistiky"
            aria-label="Detailní statistiky"
          >
            <BarChart2 size={18} color="var(--primary-color)" />
            <span className="nav-btn-label">Statistiky</span>
          </button>

          <button
            className="btn-icon nav-action-btn"
            onClick={() => setIsBackupOpen(true)}
            title="Zálohování & Obnova dat"
            aria-label="Zálohování a obnova"
          >
            <Database size={18} />
            <span className="nav-btn-label">Záloha</span>
          </button>

          <button
            className="btn-icon nav-action-btn"
            onClick={() => window.print()}
            title="Vytisknout / Uložit do PDF"
            aria-label="Tisk"
          >
            <Printer size={18} />
          </button>

          <button
            className="btn-icon nav-action-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Přepnout na světlý režim' : 'Přepnout na tmavý režim'}
            aria-label="Přepnout motiv"
          >
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#6366F1" />}
          </button>
        </div>
      </div>

      <div className="no-print">
        <ProgressChart total={goals.length} completed={completedCount} />
      </div>
      
      <div className="no-print">
        <AddGoalForm 
          categories={categories} 
          onAdd={handleAddGoal} 
          onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
          onOpenInspiration={() => setIsInspirationOpen(true)}
        />
      </div>
      
      <div style={{ marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {viewMode === 'timeline' ? 'Časová osa úspěchů' : `Vaše cíle (${filteredAndSortedGoals.length})`}
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* View Mode Toggle: List vs Board vs Timeline */}
            <div className="view-mode-toggle no-print">
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => handleToggleViewMode('list')}
                title="Zobrazení v seznamu"
                aria-label="Seznam"
              >
                <List size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
                onClick={() => handleToggleViewMode('board')}
                title="Vizuální nástěnka (Vision Board)"
                aria-label="Nástěnka"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
                onClick={() => handleToggleViewMode('timeline')}
                title="Časová osa úspěchů (Timeline)"
                aria-label="Časová osa"
              >
                <Milestone size={16} />
              </button>
            </div>

            {/* Quick stats badges */}
            <div className="quick-stats-badges" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span className="badge-stat" title="Aktivní cíle">
                <Clock size={13} /> {activeCount}
              </span>
              {priorityCount > 0 && (
                <span className="badge-stat badge-priority" title="Prioritní cíle">
                  <Star size={13} fill="#F59E0B" color="#F59E0B" /> {priorityCount}
                </span>
              )}
              <span className="badge-stat badge-completed" title="Splněné cíle">
                <CheckCircle size={13} /> {completedCount}
              </span>
            </div>
          </div>
        </div>
        
        {/* Search, Sort and Filters (hidden in timeline mode to keep timeline pure) */}
        {viewMode !== 'timeline' && (
          <>
            <div className="toolbar no-print">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Hledat v cílech, podúkolech, místech a poznámkách…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    className="btn-icon" 
                    onClick={() => setSearchQuery('')}
                    style={{ padding: '0.25rem' }}
                    aria-label="Vymazat vyhledávání"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="sort-box">
                <SlidersHorizontal size={16} />
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="smart">⭐ Podle priority</option>
                  <option value="deadline">📅 Podle termínu</option>
                  <option value="newest">🕒 Nejnovější</option>
                  <option value="alphabetical">🔤 Abecedně</option>
                </select>
              </div>
            </div>

            <div className="status-filters no-print">
              <button
                className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                Všechny ({goals.length})
              </button>
              <button
                className={`status-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Aktivní ({activeCount})
              </button>
              <button
                className={`status-btn ${statusFilter === 'priority' ? 'active' : ''}`}
                onClick={() => setStatusFilter('priority')}
              >
                ⭐ Prioritní ({priorityCount})
              </button>
              <button
                className={`status-btn ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Splněné ({completedCount})
              </button>
            </div>

            <div className="no-print">
              <CategoryFilter 
                categories={categories} 
                selectedCategoryId={filterCategoryId} 
                onSelect={setFilterCategoryId} 
              />
            </div>
          </>
        )}
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Načítám data...</div>
        ) : viewMode === 'timeline' ? (
          <TimelineView 
            goals={goals} 
            categories={categories} 
            onOpenReflection={(goal) => setReflectionGoal(goal)} 
          />
        ) : (
          <GoalList 
            goals={filteredAndSortedGoals} 
            categories={categories}
            viewMode={viewMode}
            onToggle={handleToggleGoal} 
            onDelete={handleDeleteGoal}
            onUpdate={handleUpdateGoal}
            onOpenReflection={(goal) => setReflectionGoal(goal)}
          />
        )}
      </div>

      {isManageCategoriesOpen && (
        <ManageCategories 
          categories={categories}
          goals={goals}
          onAdd={handleAddCategory} 
          onDelete={handleDeleteCategory}
          onClose={() => setIsManageCategoriesOpen(false)} 
        />
      )}

      {isBackupOpen && (
        <BackupModal
          onClose={() => setIsBackupOpen(false)}
          onDataRestored={fetchData}
        />
      )}

      {isDetailedStatsOpen && (
        <DetailedStatsModal
          goals={goals}
          categories={categories}
          onClose={() => setIsDetailedStatsOpen(false)}
        />
      )}

      {isInspirationOpen && (
        <InspirationModal
          categories={categories}
          onAddGoal={handleAddGoal}
          onClose={() => setIsInspirationOpen(false)}
        />
      )}

      {reflectionGoal && (
        <ReflectionModal
          goal={reflectionGoal}
          onSave={(goalId, updates) => handleUpdateGoal(goalId, updates)}
          onClose={() => setReflectionGoal(null)}
        />
      )}
    </div>
  );
}

export default App;
