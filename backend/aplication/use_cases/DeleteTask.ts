// src/task/application/use-cases/DeleteTask.ts
// src/task/aplication/use-cases/deleteTask.ts

import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class DeleteTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscamos la tarea en el exterior
    const taskToDelete = await this.taskRepository.findById(id);

    if (!taskToDelete) {
      throw new Error("Tarea no encontrada");
    }
    // 2. Marcamos la tarea como eliminada usando el método de la entidad
    taskToDelete.deleteEntity();

    // 3. Persistimos el cambio volviendo a guardar la tarea ya modificada
    await this.taskRepository.delete(id);
  }
}
