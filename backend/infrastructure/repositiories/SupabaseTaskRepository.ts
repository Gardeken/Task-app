import { supabase } from "../Supabase.js";
import { Task } from "../../domain/entities/task.js";
import { type TaskRepository } from "../../domain/ports/TaskRepository.js";

export class SupabaseTaskRepository implements TaskRepository {
  async save(task: Task): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .upsert({
        title: task.title,
        description: task.description, // Si decides agregar descripción a tu modelo
        is_completed: task.is_completed, // Asegúrate de que tu tabla en Supabase tenga esta columna
        created_at: task.created_at, // Asegúrate de que tu tabla en Supabase tenga esta columna
        deleted: task.deleted,
      })
      .select()
      .single();
    if (error) {
      throw new Error(`Error saving task: ${error.message}`);
    }

    return new Task(
      data.title,
      data.id,
      data.description,
      data.is_completed,
      data.created_at,
      data.deleted,
    );
  }

  // 2. Buscar una tarea por su ID
  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return null;
    }
    return new Task(
      data.id,
      data.title,
      data.description,
      data.is_completed,
      data.created_at,
      data.deleted,
    );
  }

  // 3. Obtener todas las tareas guardadas (sin importar su estado)
  async findAll(): Promise<Task[]> {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      throw new Error(`Error fetching tasks: ${error.message}`);
    }

    return data.map(
      (task: Task) =>
        new Task(
          task.title,
          task.id,
          task.description,
          task.is_completed,
          task.created_at,
          task.deleted,
        ),
    );
  }

  // 4. Eliminar una tarea por su ID (Borrado físico/Hard Delete)
  async delete(id: string): Promise<void> {
    // Aquí usarías .delete().eq('id', id)
    const { error } = await supabase
      .from("tasks")
      .update({ deleted: true })
      .eq("id", id);
    if (error) {
      throw new Error(`Error deleting task: ${error.message}`);
    }
  }

  // 5. Marcar una tarea como completada por su ID
  // Nota: Esto en Supabase se traduce en un .update({ is_completed: true }).eq('id', id)
  async complete(id: string): Promise<void> {
    // Lógica para actualizar en Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ is_completed: true })
      .eq("id", id);
    if (error) {
      throw new Error(`Error completing task: ${error.message}`);
    }
  }

  // 6. Obtener solo las tareas que están marcadas como eliminadas
  // Supabase: .select('*').eq('is_deleted', true)
  async findDeleted(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("deleted", true);
    if (error) {
      throw new Error(`Error fetching deleted tasks: ${error.message}`);
    }

    return data.map(
      (task: Task) =>
        new Task(
          task.title,
          task.id,
          task.description,
          task.is_completed,
          task.created_at,
          task.deleted,
        ),
    );
  }

  // 7. Obtener solo las tareas que no están marcadas como eliminadas
  // Supabase: .select('*').eq('is_deleted', false)
  async findActive(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("deleted", false);
    if (error) {
      throw new Error(`Error fetching active tasks: ${error.message}`);
    }
    return data.map(
      (task: Task) =>
        new Task(
          task.title,
          task.id,
          task.description,
          task.is_completed,
          task.created_at,
          task.deleted,
        ),
    );
  }

  // 8. Restaurar una tarea eliminada por su ID
  // Supabase: .update({ is_deleted: false }).eq('id', id)
  async restore(id: string): Promise<void> {
    // Lógica para actualizar en Supabase
    const { error } = await supabase
      .from("tasks")
      .update({ deleted: false })
      .eq("id", id);
    if (error) {
      throw new Error(`Error restoring task: ${error.message}`);
    }
  }
}
