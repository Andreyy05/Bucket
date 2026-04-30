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
  completed: boolean;
  createdAt: number;
}
