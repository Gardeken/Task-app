import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./infrastructure/specs/swagger.js";
import cors from "cors";
import { taskRouter } from "./infrastructure/taskRouter.js";
const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Permite únicamente a tu Front de Vite
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
  }),
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Bienvenido a la API de tareas");
});

app.get("/health", (req, res) => {
  res.send("API de tareas está saludable");
});

// Middleware obligatorio para que Express entienda los JSON que envías en el POST
app.use(express.json());

// Registramos las rutas con un prefijo opcional (ej: /api)
app.use("/api", taskRouter);
