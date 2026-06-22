// src/task/application/use-cases/CompleteTask.ts

import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class CompleteTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    // 1. Buscamos la tarea en la base de datos
    const taskToComplete = await this.taskRepository.findById(id);

    if (!taskToComplete) {
      throw new Error("Tarea no encontrada");
    }
    // 2. Marcamos la tarea como completada
    taskToComplete.complete();

    // 3. Ejecutamos el método específico en el repositorio
    await this.taskRepository.complete(id);
  }
}
