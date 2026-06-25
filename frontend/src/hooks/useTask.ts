// hooks/useTasks.ts
import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import type { Task } from "../types/tasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar las tareas al montar el componente
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getAll();
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar las tareas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const refetchTasks = async () => {
    try {
      const response = await taskService.getAll();
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar las tareas");
    }
  };

  // 2. Crear una nueva tarea
  const createTask = async (title: string, description?: string) => {
    try {
      const response = await taskService.create(title, description);
      if (response.success) {
        // Recargamos de la API para asegurarnos de traer el orden correcto del Trigger
        await fetchTasks();
      }
    } catch (err: any) {
      setError("No se pudo crear la tarea");
    }
  };

  // 3. Reordenar las tareas (Con actualización optimista 🚀)
  const reorderTasks = async (newOrderedTasks: Task[]) => {
    // A: Guardamos el estado previo por si la API falla
    const previousTasks = [...tasks];

    // B: Actualización Optimista (Cambiamos el estado de React inmediatamente)
    setTasks(newOrderedTasks);

    try {
      // Extraemos solo los IDs en el nuevo orden para el Backend
      const orderedIds = newOrderedTasks.map((task) => task.id);
      await taskService.reorder(orderedIds);
    } catch (err) {
      // C: Si el backend da error (ej. caída de red), revertimos al estado anterior
      setTasks(previousTasks);
      setError("El nuevo orden no se pudo sincronizar con el servidor.");
    }
  };

  // 4. Completar una tarea
  const toggleCompleteTask = async (id: string) => {
    try {
      // Actualización optimista local
      setTasks(
        tasks.map((t) =>
          t.id === id ? { ...t, is_completed: !t.is_completed } : t,
        ),
      );
      await taskService.toggleComplete(id);
    } catch (err) {
      fetchTasks(); // Revertir si falla
    }
  };

  // 5. Eliminar lógicamente (Soft Delete)
  const deleteTask = async (id: string) => {
    try {
      setTasks(tasks.filter((t) => t.id !== id));
      await taskService.softDelete(id);
      refetchTasks();
    } catch (err) {
      fetchTasks();
    }
  };

  const restoreTask = async (id: string) => {
    try {
      setTasks(tasks.filter((t) => t.id !== id));
      await taskService.restore(id);
      refetchTasks();
    } catch (err) {
      fetchTasks();
    }
  };

  const editTask = async (task: Task) => {
    const previous = [...tasks];

    // Cambiamos la UI primero
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

    try {
      await taskService.edit(task);
    } catch (error) {
      setTasks(previous); // Revertimos si falla
      // setErrorMessage("Error al sincronizar...");
    }
  };

  const getDeleteTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskService.getDeleted();
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar las tareas");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    setTasks,
    isLoading,
    error,
    createTask,
    reorderTasks,
    editTask,
    restoreTask,
    toggleCompleteTask,
    deleteTask,
    getDeleteTasks,
    refresh: fetchTasks,
  };
};
