// services/taskService.ts
import { apiClient } from "../api/apiClient";
import type { Task } from "../types/tasks";
// Interfaz para la estructura de respuesta estándar del Backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const taskService = {
  /**
   * Obtiene todas las tareas activas ordenadas por posición
   */
  getActive: async (): Promise<ApiResponse<Task[]>> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>("/tasks/active");
    return data;
  },

  /**
   * Obtiene todas las tareas ordenadas por posición
   */
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>("/tasks");
    return data;
  },

  /**
   * Crea una nueva tarea (Aparecerá en el tope automáticamente gracias al Trigger)
   */
  create: async (
    title: string,
    description?: string,
  ): Promise<ApiResponse<Task>> => {
    const { data } = await apiClient.post<ApiResponse<Task>>("/tasks", {
      title,
      description,
    });
    return data;
  },

  /**
   * Sincroniza el nuevo orden secuencial tras un Drag and Drop
   * Envía el lote completo de IDs en una sola petición HTTP (O(1))
   */
  reorder: async (orderedIds: string[]): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.put<ApiResponse<void>>("/tasks/reorder", {
      orderedIds,
    });
    return data;
  },

  /**
   * Obtiene los detalles de una tarea específica por ID
   */
  getById: async (id: string): Promise<ApiResponse<Task>> => {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return data;
  },

  /**
   * Alterna o marca una tarea como completada
   */
  toggleComplete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.put<ApiResponse<void>>(
      `/tasks/${id}/complete`,
    );
    return data;
  },

  /**
   * Elimina lógicamente una tarea enviándola a la papelera (Soft Delete)
   */
  softDelete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/tasks/${id}`);
    return data;
  },

  /**
   * Lista las tareas archivadas en la papelera
   */
  getDeleted: async (): Promise<ApiResponse<Task[]>> => {
    const { data } = await apiClient.get<ApiResponse<Task[]>>("/tasks/deleted");
    return data;
  },

  /**
   * Restaura una tarea de la papelera volviéndola a activar
   */
  restore: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.put<ApiResponse<void>>(
      `/tasks/${id}/restore`,
    );
    return data;
  },
};
