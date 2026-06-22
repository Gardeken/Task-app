// src/task/application/use-cases/CreateTask.ts
import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class CreateTask {
  // Pedimos el repositorio, pero no sabemos cuál implementación real llegará
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    title: string,
    description?: string,
    isCompleted?: boolean,
    deleted?: boolean,
  ): Promise<Task> {
    // 1. Instanciamos la entidad de dominio (se validará el título automáticamente)

    const newTask = new Task(
      title,
      undefined,
      description,
      isCompleted,
      undefined,
      deleted,
    );

    // 2. Usamos el puerto para guardar la tarea en "algún lado" exterior
    return await this.taskRepository.save(newTask);
  }
}
