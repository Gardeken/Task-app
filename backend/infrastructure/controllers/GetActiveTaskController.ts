// src/task/infrastructure/controllers/GetActiveTaskController.ts

import type { Request, Response } from "express";
import type { GetActiveTask } from "../../aplication/use_cases/GetActiveTask.js";

export class GetActiveTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private getActiveTaskUseCase: GetActiveTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      const tasks = await this.getActiveTaskUseCase.execute();

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  }
}
