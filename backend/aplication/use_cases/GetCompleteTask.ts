// src/task/application/use-cases/GetCompleteTask.ts
import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class GetCompleteTask {
  // Pedimos el repositorio, pero no sabemos cuál implementación real llegará
  constructor(private taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return await this.taskRepository.findActive();
  }
}
