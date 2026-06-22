// src/task/infrastructure/taskRouter.ts

import { Router } from "express";
import { SupabaseTaskRepository } from "./repositiories/SupabaseTaskRepository.js";
import { CreateTask } from "../aplication/use_cases/CreateTask.js";
import { CreateTaskController } from "./controllers/CreateTaskController.js";
import { GetAllTask } from "../aplication/use_cases/GetAllTask.js";
import { GetAllTaskController } from "./controllers/GetAllTaskController.js";
import { DeleteTask } from "../aplication/use_cases/DeleteTask.js";
import { DeleteTaskController } from "./controllers/DeleteTaskController.js";
import { RestoreTask } from "../aplication/use_cases/RestoreTask.js";
import { RestoreTaskController } from "./controllers/RestoreTaskController.js";
import { GetDeleteTaskController } from "./controllers/GetDeleteTaskController.js";
import { GetDeleteTask } from "../aplication/use_cases/GetDeleteTask.js";
import { GetCompleteTask } from "../aplication/use_cases/GetCompleteTask.js";
import { GetCompleteTaskController } from "./controllers/GetCompleteTaskController.js";
import { GetTaskController } from "./controllers/GetTaskController.js";
import { GetTask } from "../aplication/use_cases/GetTask.js";
import { CompleteTask } from "../aplication/use_cases/CompleteTask.js";
import { CompleteTaskController } from "./controllers/CompleteTaskController.js";

const taskRouter = Router();

// 1. Instanciamos el adaptador de base de datos
const taskRepository = new SupabaseTaskRepository();

// 2. Instanciamos el caso de uso y le pasamos el repositorio
const createTaskUseCase = new CreateTask(taskRepository);
const getAllTaskUseCase = new GetAllTask(taskRepository);
const getTaskUseCase = new GetTask(taskRepository);
const getDeleteTaskUseCase = new GetDeleteTask(taskRepository);
const getCompleteTaskUseCase = new GetCompleteTask(taskRepository);
const deleteTaskUseCase = new DeleteTask(taskRepository);
const restoreTaskUseCase = new RestoreTask(taskRepository);
const completeTaskUseCase = new CompleteTask(taskRepository);

// 3. Instanciamos el controlador y le pasamos el caso de uso
const createTaskController = new CreateTaskController(createTaskUseCase);
const getTaskController = new GetTaskController(getTaskUseCase);
const getAllTaskController = new GetAllTaskController(getAllTaskUseCase);
const getDeleteTaskController = new GetDeleteTaskController(
  getDeleteTaskUseCase,
);
const getCompleteTaskController = new GetCompleteTaskController(
  getCompleteTaskUseCase,
);
const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);
const restoreTaskController = new RestoreTaskController(restoreTaskUseCase);
const completeTaskController = new CompleteTaskController(completeTaskUseCase);

// 4. Definimos la ruta de Express
taskRouter.post("/tasks", (req, res) => createTaskController.handle(req, res));
taskRouter.get("/tasks", (req, res) => getAllTaskController.handle(req, res));
taskRouter.get("/tasks/deleted", (req, res) =>
  getDeleteTaskController.handle(req, res),
);
taskRouter.get("/tasks/completed", (req, res) =>
  getCompleteTaskController.handle(req, res),
);
taskRouter.get("/tasks/:id", (req, res) => getTaskController.handle(req, res));
taskRouter.delete("/tasks/:id", (req, res) =>
  deleteTaskController.handle(req, res),
);
taskRouter.put("/tasks/:id/restore", (req, res) =>
  restoreTaskController.handle(req, res),
);
taskRouter.put("/tasks/:id/complete", (req, res) =>
  completeTaskController.handle(req, res),
);

export { taskRouter };
