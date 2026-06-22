// src/task/infrastructure/controllers/ReorderTaskController.ts

import type { Request, Response } from "express";
import type { GetAllTask } from "../../aplication/use_cases/GetAllTask.js";
import type { ReorderTask } from "../../aplication/use_cases/ReorderTask.js";

export class ReorderTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private reorderTaskUseCase: ReorderTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { orderedIds } = req.body;

      const tasks = await this.reorderTaskUseCase.execute(orderedIds);

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
