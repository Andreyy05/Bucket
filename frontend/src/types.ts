export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  categoryId: string;
  state: 'active' | 'completed';
  createdAt: number;
  deadline?: string | null;
  notes?: string;
  priority?: number;
  completedAt?: number | null;
  subtasks?: Subtask[];
  imageUrl?: string | null;
  budget?: number | null;
  rating?: number | null; // 1-5 stars
  reflection?: string;
  location?: string;
}
