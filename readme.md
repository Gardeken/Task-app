# Task Manager App 🚀

Una aplicación moderna de gestión de tareas construida bajo los principios de la **Arquitectura Hexagonal (Clean Architecture)** y **Domain-Driven Design (DDD)** en el backend, preparada para una integración fluida con un cliente SPA en el frontend.

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** (v22+) con **TypeScript**
- **Express.js** (Framework HTTP)
- **Supabase** (PostgreSQL como servicio de persistencia)
- **Swagger UI / OpenAPI 3.0** (Documentación interactiva de la API)
- **TSX** (Ejecución y monitoreo en tiempo real)

### Frontend (En proceso)

- **React** + **TypeScript** (Iniciado vía **Vite**)

---

## 📐 Arquitectura del Backend

El backend está estructurado en capas independientes para garantizar el desacoplamiento tecnológico y facilitar la mantenibilidad y el testing:

- **Dominio (Domain):** Contiene el núcleo del negocio. Las entidades (`Task`) controlan sus propias reglas de estado (completar, soft-delete, restaurar) y definen los puertos/interfaces (`TaskRepository`) sin depender de librerías externas.
- **Aplicación (Application):** Orquesta los flujos de trabajo a través de **Casos de Uso** individuales (`CreateTask`, `DeleteTask`, `CompleteTask`, etc.).
- **Infraestructura (Infrastructure):** Detalles técnicos de entrada y salida. Implementa los controladores de Express, los adaptadores de Supabase y la configuración de Swagger.

---

## 📝 Documentación de la API (Swagger UI)

El proyecto cuenta con documentación nativa interactiva que expone todos los endpoints del sistema. Una vez que el servidor esté corriendo, puedes acceder a la interfaz gráfica de Swagger para revisar los contratos de datos y probar las peticiones reales directamente desde el navegador:

🔗 **Ruta de acceso:** **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Endpoints Mapeados en la Documentación:

- `POST /api/tasks` - Crear una nueva tarea.
- `GET /api/tasks` - Listar todas las tareas activas.
- `GET /api/tasks/deleted` - Ver tareas en la papelera (Soft Deleted).
- `GET /api/tasks/completed` - Ver tareas completadas.
- `GET /api/tasks/:id` - Obtener el detalle de una tarea específica.
- `DELETE /api/tasks/:id` - Eliminar lógicamente una tarea (Soft Delete).
- `PUT /api/tasks/:id/restore` - Restaurar una tarea borrada de la papelera.
- `PUT /api/tasks/:id/complete` - Marcar una tarea como resuelta.

---

## 💻 Comandos del Proyecto (Scripts)

Ejecuta estos comandos en la raíz del backend según la etapa de desarrollo en la que te encuentres:

| Comando         | Descripción                                                                                               |
| :-------------- | :-------------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Inicia el entorno de desarrollo usando `tsx watch` e inyectando las variables del `.env`.                 |
| `npm run build` | Compila todo el proyecto TypeScript (`tsc`) y genera el código JavaScript nativo en la carpeta `/dist`.   |
| `npm start`     | Arranca el servidor de producción ejecutando directamente los archivos compilados (`node dist/index.js`). |

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio y dependencias

```bash
# Instalar dependencias del proyecto raíz
npm install
```
