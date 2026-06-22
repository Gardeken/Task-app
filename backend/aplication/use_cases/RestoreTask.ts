// src/task/application/use-cases/RestoreTask.ts

import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class RestoreTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscamos la tarea en la base de datos
    const taskToRestore = await this.taskRepository.findById(id);

    if (!taskToRestore) {
      throw new Error("Tarea no encontrada");
    }

    // 2. La entidad cambia internamente 'deleted' a false.
    // (Si agregas lógica en tu entidad para que tire error si la tarea NO estaba borrada, saltará aquí)
    taskToRestore.restore();

    // 3. Ejecutamos el método específico en el repositorio
    await this.taskRepository.restore(id);
  }
}
