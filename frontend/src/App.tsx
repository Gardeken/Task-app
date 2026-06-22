import {
  closestCorners,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import "./App.css";
import { useState } from "react";
import type { Task } from "./types/tasks";
import { TaskComponent } from "./Components/TaskComponent";
import { CreateTaskModal } from "./Components/CreateTaskComponent";
import { ViewTaskModal } from "./Components/ViewTaskComponent";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2, Plus } from "lucide-react";
import { useTasks } from "./hooks/useTask";

function App() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    reorderTasks,
    toggleCompleteTask,
    deleteTask,
    restoreTask,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<
    "all" | "completed" | "deleted" | "pending"
  >("all");

  const handleSaveTask = async (
    newTaskData: Omit<Task, "id" | "created_at" | "deleted">,
  ) => {
    const { title, description } = newTaskData;
    await createTask(title, description || ""); // Pasamos parámetros independientes
    setIsModalOpen(false); // Cerramos el modal tras guardar
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const originalIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      // Calculamos el nuevo array movido
      const newOrderedTasks = arrayMove(tasks, originalIndex, newIndex);

      // 🚀 3. Llama a la actualización optimista del hook (Sincroniza con el backend automáticamente)
      reorderTasks(newOrderedTasks);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === "deleted") return task.deleted === true;
    if (filter === "completed")
      return task.is_completed === true && !task.deleted;
    if (filter === "pending") return !task.is_completed && !task.deleted;
    // "all" -> Muestra las tareas activas que NO están completadas ni eliminadas
    return !task.deleted;
  });

  return (
    <div className="flex flex-col m-auto h-screen w-1/2 items-center justify-center gap-2 text-2xl font-bold">
      <div className="flex justify-between items-center w-full mt-4 mb-2">
        {/* 🎛️ Grupo de Filtros */}
        <div className="flex gap-2 text-sm font-medium select-none">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-slate-800 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Todas
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              filter === "pending"
                ? "bg-slate-800 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Pendientes
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Completadas
          </button>

          <button
            onClick={() => setFilter("deleted")}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              filter === "deleted"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            Papelera
          </button>
        </div>

        {/* ➕ Botón Añadir Tarea */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white p-2.5 rounded-xl cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      {error && (
        <div className="w-full text-xs text-red-600 bg-red-50 p-2 rounded-xl text-center font-normal border border-red-100">
          {error}
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-2 bg-gray-100 p-4 w-full h-1/2 rounded-md">
          {isLoading ? (
            <div className="flex flex-col gap-2 justify-center items-center h-full text-gray-500 text-sm font-normal">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span>Cargando tareas desde el servidor...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-400 text-sm font-normal">
              No hay tareas pendientes. ¡Crea una nueva!
            </div>
          ) : (
            <SortableContext
              items={filteredTasks}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map((t) => (
                <TaskComponent
                  key={t.id}
                  task={t}
                  onToggleComplete={toggleCompleteTask}
                  onDelete={deleteTask}
                  onRestore={restoreTask}
                  onOpenDetails={(task) => setSelectedTask(task)}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />

      <ViewTaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

export default App;
