// infrastructure/taskDocs.ts

export const taskSwaggerDocs = {
  components: {
    schemas: {
      Task: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "7a4c3632-bbe8-46e5-b9e4-8d6e2fb1a3da",
          },
          title: { type: "string", example: "Aprender Arquitectura Hexagonal" },
          isCompleted: { type: "boolean", example: false },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-22T02:19:51.076Z",
          },
          deleted: { type: "boolean", example: false },
        },
      },
      TaskResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Task" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Mensaje de error de negocio" },
        },
      },
    },
  },
  paths: {
    "/tasks": {
      post: {
        summary: "Crear una nueva tarea",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string", example: "Comprar pan" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Tarea creada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: {
            description: "Error en los datos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        summary: "Obtener todas las tareas activas",
        tags: ["Tasks"],
        responses: {
          200: {
            description: "Lista de tareas obtenida",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Task" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/tasks/deleted": {
      get: {
        summary: "Listar todas las tareas eliminadas lógicamente",
        tags: ["Tasks"],
        responses: {
          200: { description: "Lista de tareas archivadas obtenida" },
        },
      },
    },
    "/tasks/completed": {
      get: {
        summary: "Listar todas las tareas completadas",
        tags: ["Tasks"],
        responses: {
          200: { description: "Lista de tareas completadas obtenida" },
        },
      },
    },
    "/tasks/{id}": {
      get: {
        summary: "Obtener una tarea por su ID",
        tags: ["Tasks"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Tarea encontrada" },
          404: { description: "Tarea no encontrada" },
        },
      },
      delete: {
        summary: "Eliminar lógicamente una tarea (Soft Delete)",
        tags: ["Tasks"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Tarea eliminada correctamente" },
          400: { description: "Conflicto de negocio" },
        },
      },
    },
    "/tasks/{id}/restore": {
      put: {
        summary: "Restaurar una tarea previamente eliminada",
        tags: ["Tasks"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Tarea restaurada" },
        },
      },
    },
    "/tasks/{id}/complete": {
      put: {
        summary: "Marcar una tarea como completada",
        tags: ["Tasks"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Tarea completada" },
        },
      },
    },
  },
};
