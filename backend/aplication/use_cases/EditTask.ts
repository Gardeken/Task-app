import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class EditTask {
  constructor(private taskRepository: TaskRepository) {}

  async execute(task: Task): Promise<void> {
    if (!task.id) {
      throw new Error("Debe incluir un id para editar la tarea");
    }

    const taskToEdit = await this.taskRepository.findById(task.id);

    if (!taskToEdit) {
      throw new Error("Tarea no encontrada");
    }
    taskToEdit.edit();

    await this.taskRepository.edit(task);
  }
}
