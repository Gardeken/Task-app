// src/task/application/use-cases/GetTask.ts
import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class GetTask {
  // Pedimos el repositorio, pero no sabemos cuál implementación real llegará
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }
}
