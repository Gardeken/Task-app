// src/task/infrastructure/controllers/CompleteTaskController.ts

import type { Request, Response } from "express";
import type { CompleteTask } from "../../aplication/use_cases/CompleteTask.js";

export class CompleteTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private completeTaskUseCase: CompleteTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // ✅ Ahora extraemos más datos del cuerpo de la petición (JSON)
      // Puedes pasarle un valor por defecto si el cliente no los envía
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        throw new Error("ID de tarea es requerido");
      }

      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      await this.completeTaskUseCase.execute(id);

      res.status(201).json({
        success: true,
        data: { message: "Tarea completada correctamente" },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  }
}
