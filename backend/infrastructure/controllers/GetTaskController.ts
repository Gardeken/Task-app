// src/task/infrastructure/controllers/GetTaskController.ts

import type { Request, Response } from "express";
import type { GetTask } from "../../aplication/use_cases/GetTask.js";

export class GetTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private getTaskUseCase: GetTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        throw new Error("ID de tarea es requerido");
      }

      const task = await this.getTaskUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  }
}
