import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, Category } from './types';
import { AddGoalForm } from './components/AddGoalForm';
import { GoalList } from './components/GoalList';
import { ProgressChart } from './components/ProgressChart';
import { CategoryFilter } from './components/CategoryFilter';
import { ManageCategories } from './components/ManageCategories';

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, catRes] = await Promise.all([
          fetch('/api/goals'),
          fetch('/api/categories')
        ]);
        if (!goalsRes.ok || !catRes.ok) throw new Error('Network response was not ok');
        
        const goalsData = await goalsRes.json();
        const catData = await catRes.json();
        
        setGoals(goalsData);
        setCategories(catData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddGoal = async (title: string, categoryId: string) => {
    const newGoal: Goal = {
      id: uuidv4(),
      title,
      categoryId,
      completed: false,
      createdAt: Date.now(),
    };

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (response.ok) {
        setGoals((prev) => [newGoal, ...prev]);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleToggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    setGoals((prev) => 
      prev.map(g => 
        g.id === id ? { ...g, completed: !g.completed } : g
      )
    );

    try {
      await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !goal.completed })
      });
    } catch (error) {
      console.error('Error toggling goal:', error);
      setGoals((prev) => 
        prev.map(g => 
          g.id === id ? { ...g, completed: goal.completed } : g
        )
      );
    }
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
    const newCat = { id: uuidv4(), name, icon, color };
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create category');
    }

    const createdCat = await response.json();
    setCategories(prev => [...prev, createdCat]);
  };

  const completedCount = goals.filter(g => g.completed).length;
  
  const filteredGoals = filterCategoryId === null 
    ? goals 
    : goals.filter(g => g.categoryId === filterCategoryId);

  return (
    <div className="container">
      <div className="header">
        <h1>Bucket</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Vaše životní sny a cíle na jednom místě.
        </p>
      </div>

      <ProgressChart total={goals.length} completed={completedCount} />
      
      <AddGoalForm 
        categories={categories} 
        onAdd={handleAddGoal} 
        onOpenManageCategories={() => setIsManageCategoriesOpen(true)}
      />
      
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Vaše cíle</h2>
        
        <CategoryFilter 
          categories={categories} 
          selectedCategoryId={filterCategoryId} 
          onSelect={setFilterCategoryId} 
        />
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Načítám data...</div>
        ) : (
          <GoalList 
            goals={filteredGoals} 
            categories={categories}
            onToggle={handleToggleGoal} 
            onDelete={handleDeleteGoal} 
          />
        )}
      </div>

      {isManageCategoriesOpen && (
        <ManageCategories 
          onAdd={handleAddCategory} 
          onClose={() => setIsManageCategoriesOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
