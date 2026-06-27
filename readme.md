# Task Manager App 🚀

Una aplicación moderna de gestión de tareas construida bajo los principios de la **Arquitectura Hexagonal (Clean Architecture)** y **Domain-Driven Design (DDD)** en el backend, preparada para una integración fluida con un cliente SPA en el frontend.

Url de producción: https://task-p917wniq9-gardekens-projects.vercel.app

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** (v22+) con **TypeScript**
- **Express.js** (Framework HTTP)
- **Supabase** (PostgreSQL como servicio de persistencia)
- **Swagger UI / OpenAPI 3.0** (Documentación interactiva de la API)
- **TSX** (Ejecución y monitoreo en tiempo real)

### Frontend

- **React** (v19) + **TypeScript** (Iniciado vía **Vite**)
- **Tailwind CSS v4** (Estilos modernos y optimizados)
- **@dnd-kit/core & @dnd-kit/sortable** (Sistema de arrastrar y soltar fluido y responsivo)
- **Lucide React** (Paquete de iconografía)
- **Axios** (Estrategia de consumo de servicios desacoplada)

---

## 📐 Arquitectura del Sistema

### Backend (Hexagonal + DDD)

El backend está estructurado en capas independientes para garantizar el desacoplamiento tecnológico y facilitar la mantenibilidad y el testing:

- **Dominio (Domain):** Contiene el núcleo del negocio. Las entidades (`Task`) controlan sus propias reglas de estado (completar, soft-delete, restaurar) y definen los puertos/interfaces (`TaskRepository`) sin depender de librerías externas.
- **Aplicación (Application):** Orquesta los flujos de trabajo a través de **Casos de Uso** individuales (`CreateTask`, `DeleteTask`, `CompleteTask`, etc.).
- **Infraestructura (Infrastructure):** Detalles técnicos de entrada y salida. Implementa los controladores de Express, los adaptadores de Supabase y la configuración de Swagger.

### Frontend (Servicios + Hooks + UI)

La interfaz se diseñó de manera limpia, abstrayendo el comportamiento asíncrono de los componentes visuales:

- **Client & Services:** Centralizan el uso de Axios y aíslan las llamadas HTTP.
- **Custom Hooks (`useTasks`):** Manejan el estado de React aplicando **actualizaciones optimistas** (las tareas se reordenan o completan instantáneamente en la interfaz en 0ms, procesando la sincronización en silencio por detrás).

---

## 📝 Documentación de la API (Swagger UI)

El proyecto cuenta con documentación nativa interactiva que expone todos los endpoints del sistema. Una vez que el servidor esté corriendo, puedes acceder a la interfaz gráfica de Swagger para revisar los contratos de datos y probar las peticiones reales directamente desde el navegador:

🔗 **Ruta de acceso:** **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Endpoints Mapeados en la Documentación:

- `POST /api/tasks` - Crear una nueva tarea.
- `GET /api/tasks` - Listar todas las tareas activas (ordenadas posicionalmente).
- `PUT /api/tasks/reorder` - Actualizar el orden masivo de la lista mediante una secuencia de IDs (Drag and Drop).
- `PUT /api/tasks` - Editar el título o descripción de alguna tarea.
- `GET /api/tasks/deleted` - Ver tareas en la papelera (Soft Deleted).
- `GET /api/tasks/completed` - Ver tareas completadas.
- `GET /api/tasks/:id` - Obtener el detalle de una tarea específica.
- `DELETE /api/tasks/:id` - Eliminar lógicamente una tarea (Soft Delete).
- `PUT /api/tasks/:id/restore` - Restaurar una tarea borrada de la papelera.
- `PUT /api/tasks/:id/complete` - Marcar o alternar una tarea como resuelta.

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
# Clonar el repositorio
git clone [https://github.com/Gardeken/Task-app](https://github.com/Gardeken/Task-app)
cd tu-repositorio

# Instalar dependencias del proyecto raíz
npm install
```
