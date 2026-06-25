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
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("position", { ascending: true });
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
    // 1. Buscamos el estado actual de la tarea
    const { data: task, error: fetchError } = await supabase
      .from("tasks")
      .select("is_completed")
      .eq("id", id)
      .single();

    if (fetchError || !task) {
      throw new Error(`Task not found: ${fetchError?.message}`);
    }

    // 2. Actualizamos con el valor exactamente opuesto (!)
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ is_completed: !task.is_completed }) // Cambia true a false, y viceversa
      .eq("id", id);

    if (updateError) {
      throw new Error(`Error toggling task status: updateError.message`);
    }
  }

  // 6. Obtener solo las tareas que están marcadas como eliminadas
  // Supabase: .select('*').eq('is_deleted', true)
  async findDeleted(): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("deleted", true)
      .order("position", { ascending: true });
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
      .eq("deleted", false)
      .order("position", { ascending: true });
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

  // 9. Reordenar tareas (actualizar la posición de una tarea)
  async reorder(orderedIds: string[]): Promise<void> {
    if (!orderedIds || orderedIds.length === 0) {
      throw new Error("No se proporcionaron IDs para reordenar.");
    }

    // 1. Preparamos un único array de objetos con los datos mínimos a actualizar
    const payload = orderedIds.map((id, index) => ({
      id: id, // Clave primaria para que Supabase sepa a qué fila aplicar el cambio
      position: index + 1, // Nueva posición correlativa
    }));

    // 2. 🚀 Una sola petición de red con todo el lote de datos
    const { error } = await supabase.from("tasks").upsert(payload); // Al pasarle un array, ejecuta un único comando masivo en Postgres

    if (error) {
      throw new Error(
        `Error reordering tasks via bulk upsert: ${error.message}`,
      );
    }
  }

  // 10. Editar tareas
  async edit(task: Task): Promise<void> {
    const { error } = await supabase
      .from("tasks")
      .update({ title: task.title, description: task.description })
      .eq("id", task.id);
    if (error) {
      throw new Error(`Error editing task: ${error.message}`);
    }
  }
}
