// src/task/infrastructure/controllers/CreateTaskController.ts

import type { Request, Response } from "express";
import { CreateTask } from "../../aplication/use_cases/CreateTask.js";

export class CreateTaskController {
  // El controlador necesita el Caso de Uso específico para trabajar
  constructor(private createTaskUseCase: CreateTask) {}
  async handle(req: Request, res: Response): Promise<void> {
    try {
      // ✅ Ahora extraemos más datos del cuerpo de la petición (JSON)
      // Puedes pasarle un valor por defecto si el cliente no los envía
      const { title, description, isCompleted, deleted } = req.body;

      // Ejecutamos el caso de uso pasándole todos los parámetros
      // Nota: Tu caso de uso también tendrá que aceptar estos argumentos extra
      const taskCreated = await this.createTaskUseCase.execute(
        title,
        description, // Si decides agregar descripción a tu modelo
        isCompleted,
        deleted,
      );

      res.status(201).json({
        success: true,
        data: taskCreated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Error interno del servidor",
      });
    }
  }
}
