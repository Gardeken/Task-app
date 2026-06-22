// src/task/application/use-cases/ReorderTask.ts

import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class ReorderTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(orderedIds: string[]): Promise<void> {
    // 1. Validamos que todos los IDs existan en la base de datos
    const allTasks = await this.taskRepository.findAll();
    const allTaskIds = allTasks.map((task) => task.id);
    const invalidIds = orderedIds.filter((id) => !allTaskIds.includes(id));

    if (invalidIds.length > 0) {
      throw new Error(
        `Los siguientes IDs no existen en la base de datos: ${invalidIds.join(
          ", ",
        )}`,
      );
    }

    // 2. Ejecutamos el método específico en el repositorio
    await this.taskRepository.reorder(orderedIds);
  }
}
