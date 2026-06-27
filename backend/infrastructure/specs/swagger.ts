// src/task/infrastructure/specs/swagger.ts

import swaggerJSDoc from "swagger-jsdoc";
import { taskSwaggerDocs } from "../taskDocs.js";
const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3000";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task API - Arquitectura Hexagonal",
      version: "1.0.0",
      description:
        "Documentación de la API de Tareas utilizando Supabase y TypeScript",
    },
    servers: [
      {
        url: `${API_BASE_URL}/api`,
        description: "Servidor Local de Desarrollo",
      },
    ],
    tags: [{ name: "Tasks", description: "Operaciones del módulo de Tareas" }],
    // 🎯 Fusionamos los esquemas y las rutas del JSON de forma nativa:
    components: taskSwaggerDocs.components,
    paths: taskSwaggerDocs.paths,
  },
  // 🎯 Muy importante: Especifica dónde buscará Swagger los comentarios de las rutas
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
