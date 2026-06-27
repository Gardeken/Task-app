// infrastructure/taskDocs.ts

export const taskSwaggerDocs = {
  components: {
    schemas: {
      // 1. Esquema base de una Tarea (Modelo del dominio)
      Task: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            example: "7a4c3632-bbe8-46e5-b9e4-8d6e2fb1a3da",
          },
          title: { type: "string", example: "Aprender Arquitectura Hexagonal" },
          description: {
            type: "string",
            example: "Estructurar capas independientes y desacopladas.",
          },
          isCompleted: { type: "boolean", example: false },
          position: {
            type: "integer",
            example: 1,
            description:
              "Índice numérico correlativo que define el orden de la tarea.",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-06-22T02:19:51.076Z",
          },
          deleted: { type: "boolean", example: false },
        },
      },

      // 🎯 NUEVO: Esquema con los campos específicos que viajan al editar
      TaskUpdateFields: {
        type: "object",
        required: ["id"], // El ID es obligatorio para saber qué fila impactar en Supabase
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "UUID de la tarea a modificar",
            example: "5a74466c-c4b4-472c-b6e1-9932afd0e334",
          },
          title: {
            type: "string",
            description: "Nuevo título para la tarea",
            example: "Estructurar el Repositorio",
          },
          description: {
            type: "string",
            description: "Nueva descripción detallada de la tarea",
            example: "Terminar mis tareas del dia",
          },
        },
      },

      // 🎯 NUEVO: Envoltorio raíz "task" exigido por tu Body Request de pruebas
      EditTaskRequest: {
        type: "object",
        required: ["task"],
        properties: {
          task: {
            $ref: "#/components/schemas/TaskUpdateFields",
          },
        },
      },

      // Respuestas genéricas de la API
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
      // ➕ ENDPOINT AGREGADO: Editar Tarea
      put: {
        summary: "Editar una tarea existente",
        description:
          "Actualiza las propiedades de una tarea (como el título o la descripción) en Supabase buscando por su ID interno.",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EditTaskRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Tarea actualizada correctamente en el servidor",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TaskResponse" },
              },
            },
          },
          400: {
            description:
              "Petición inválida (Falta el objeto raíz 'task' o el campo 'id')",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "No se encontró la tarea especificada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
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
                  description: {
                    type: "string",
                    example: "Pasar por la panadería del centro.",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description:
              "Tarea creada (Asigna posición 1 automáticamente a través del Trigger)",
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
        notes:
          "Devuelve las tareas ordenadas de forma ascendente por su posición.",
        tags: ["Tasks"],
        responses: {
          200: {
            description: "Lista de tareas obtenida en orden secuencial",
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
    "/tasks/reorder": {
      put: {
        summary: "Actualizar el orden posicional de las tareas (Drag and Drop)",
        tags: ["Tasks"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderedIds"],
                properties: {
                  orderedIds: {
                    type: "array",
                    description:
                      "Lista ordenada de UUIDs que dictaminan la nueva secuencia posicional.",
                    items: {
                      type: "string",
                      format: "uuid",
                    },
                    example: [
                      "7a4c3632-bbe8-46e5-b9e4-8d6e2fb1a3da",
                      "bdd4134b-781d-45d4-bd73-d24ba1757a47",
                      "94f0d681-15b1-4866-884b-1d453f3b0f88",
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description:
              "El orden de las tareas se actualizó correctamente mediante la función RPC.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Orden actualizado correctamente",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Payload malformado o faltante",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description:
              "Error interno procesando el reordenamiento en Supabase",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
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
