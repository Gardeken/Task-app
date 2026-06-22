export interface Task {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  deleted: boolean;
  position?: number; // Nueva propiedad para el orden de las tareas
}
