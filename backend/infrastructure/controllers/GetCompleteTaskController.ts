// src/task/infrastructure/controllers/GetCompleteTaskController.ts

import type { Request, Response } from "express";
import type { GetCompleteTask } from "../../aplication/use_cases/GetCompleteTask.js";

export class GetCompleteTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private getCompleteTaskUseCase: GetCompleteTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      const tasks = await this.getCompleteTaskUseCase.execute();

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
