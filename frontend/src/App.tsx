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
import { Plus } from "lucide-react";

function App() {
  const [task, setTask] = useState<Task[]>([
    {
      id: "1",
      title: "Task 1",
      description: "Description for Task 1",
      is_completed: false,
      created_at: new Date().toISOString(),
      deleted: false,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Description for Task 2",
      is_completed: false,
      created_at: new Date().toISOString(),
      deleted: false,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Description for Task 3",
      is_completed: false,
      created_at: new Date().toISOString(),
      deleted: false,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const handleSaveTask = (
    newTaskData: Omit<Task, "id" | "created_at" | "deleted">,
  ) => {
    const newFullTask: Task = {
      ...newTaskData,
      id: crypto.randomUUID(), // Genera un ID único temporal
      created_at: new Date().toISOString(),
      deleted: false,
    };

    setTask((prev) => [newFullTask, ...prev]); // Añade la tarea al inicio de la lista
  };

  const getTaskPosition = (id: string) => task.findIndex((t) => t.id === id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTask((task) => {
        const originalIndex = getTaskPosition(active.id);
        const newIndex = getTaskPosition(over.id);
        return arrayMove(task, originalIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleToggleComplete = (id: string) => {
    setTask((prevTasks) =>
      prevTasks.map((t) =>
        t.id === id ? { ...t, is_completed: !t.is_completed } : t,
      ),
    );
    // 💡 TIP: Aquí es donde luego disparas tu fetch/axios hacia el backend:
    // axios.put(`/api/tasks/${id}/complete`)
  };

  const handleDeleteTask = (id: string) => {
    setTask((prevTasks) => prevTasks.filter((t) => t.id !== id));
    // 💡 TIP: Backend link -> axios.delete(`/api/tasks/${id}`)
  };

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
          <SortableContext items={task} strategy={verticalListSortingStrategy}>
            {task.map((t) => (
              <TaskComponent
                key={t.id}
                task={t}
                onToggleComplete={handleToggleComplete} // 👈 Conectado
                onDelete={handleDeleteTask}
                onOpenDetails={(task) => setSelectedTask(task)} // 👈 Aquí puedes abrir un modal con más info
              />
            ))}
          </SortableContext>
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
