// src/task/application/use-cases/GetDeleteTask.ts
import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class GetDeleteTask {
  // Pedimos el repositorio, pero no sabemos cuál implementación real llegará
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findDeleted();
  }
}
