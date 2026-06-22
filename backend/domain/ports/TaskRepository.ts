// src/task/domain/ports/TaskRepository.ts
import { Task } from "../entities/task.js";

export interface TaskRepository {
  // 1. Guardar o actualizar una tarea
  save(task: Task): Promise<Task>;

  // 2. Buscar una tarea por su ID (puede devolver la Task o null si no existe)
  findById(id: string): Promise<Task | null>;

  // 3. Obtener todas las tareas guardadas
  findAll(): Promise<Task[]>;

  // 4. Eliminar una tarea por su ID
  delete(id: string): Promise<void>;

  // 5. Marcar una tarea como completada por su ID
  complete(id: string): Promise<void>;

  //6. Obtener solo las tareas que están marcadas como eliminadas
  findDeleted(): Promise<Task[]>;

  //7. Obtener solo las tareas que no están marcadas como eliminadas
  findActive(): Promise<Task[]>;

  //8. Restaurar una tarea eliminada por su ID (marcarla como no eliminada)
  restore(id: string): Promise<void>;

  //9. Reordenar tareas (actualizar la posición de una tarea)
  reorder(orderedIds: string[]): Promise<void>;
}
