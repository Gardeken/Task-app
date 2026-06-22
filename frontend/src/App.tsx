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
    setTasks,
    isLoading,
    error,
    createTask,
    reorderTasks,
    toggleCompleteTask,
    deleteTask,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  return (
    <div className="flex flex-col m-auto h-screen w-1/2 items-center justify-center gap-2 text-2xl font-bold">
      <div
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="self-end items-center gap-2 flex bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
      </div>
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
              items={tasks}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((t) => (
                <TaskComponent
                  key={t.id}
                  task={t}
                  onToggleComplete={toggleCompleteTask} // 🚀 Conectado al Hook
                  onDelete={deleteTask} // 🚀 Conectado al Hook
                  onOpenDetails={(task) => setSelectedTask(task)}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

      <ViewTaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}

export default App;
