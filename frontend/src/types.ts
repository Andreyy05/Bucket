export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  categoryId: string;
  state: 'active' | 'completed';
  createdAt: number;
}
