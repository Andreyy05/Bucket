import React, { useState, useEffect } from 'react';
import type { Goal, Category } from '../types';
import { StatisticsCard } from '../components/StatisticsCard';
import { FilterBar } from '../components/FilterBar';
import { TargetGrid } from '../components/TargetGrid';

export const DashboardView = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        
        setGoals(goalsData.itemList || []);
        setCategories(catData.itemList || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    setGoals((prev) => 
      prev.map(g => 
        g.id === id ? { ...g, state: g.state === 'active' ? 'completed' : 'active' } : g
      )
    );

    try {
      await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: goal.state === 'active' ? 'completed' : 'active' })
      });
    } catch (error) {
      console.error('Error toggling goal:', error);
      // Revert on error
      setGoals((prev) => 
        prev.map(g => 
          g.id === id ? { ...g, state: goal.state } : g
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

  const completedCount = goals.filter(g => g.state === 'completed').length;
  const filteredGoals = filterCategoryId === null 
    ? goals 
    : goals.filter(g => g.categoryId === filterCategoryId);

  return (
    <div>
      <div className="header">
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Vaše životní sny a cíle na jednom místě.
        </p>
      </div>

      <StatisticsCard total={goals.length} completed={completedCount} />
      
      <div style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Vaše cíle</h2>
        
        <FilterBar 
          categories={categories} 
          selectedCategoryId={filterCategoryId} 
          onSelect={setFilterCategoryId} 
        />
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Načítám data...</div>
        ) : (
          <TargetGrid 
            goals={filteredGoals} 
            categories={categories}
            onToggle={handleToggleGoal} 
            onDelete={handleDeleteGoal} 
          />
        )}
      </div>
    </div>
  );
};
