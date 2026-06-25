// src/task/infrastructure/controllers/EditTaskController.ts

import type { Request, Response } from "express";
import type { EditTask } from "../../aplication/use_cases/EditTask.js";
import { Task } from "../../domain/entities/task.js";

export class EditTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private EditTaskUseCase: EditTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // ✅ Ahora extraemos más datos del cuerpo de la petición (JSON)
      // Puedes pasarle un valor por defecto si el cliente no los envía
      const { task } = req.body;

      if (!task) {
        throw new Error("ID de tarea es requerido");
      }

      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      await this.EditTaskUseCase.execute(task);

      res.status(201).json({
        success: true,
        data: { message: "Tarea editada correctamente" },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  }
}
