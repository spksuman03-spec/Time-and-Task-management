import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { KanbanColumn } from './KanbanColumn';
import { taskService } from '../../services/taskService';
import { useToast } from '../common/Toast';

export const KanbanBoard = ({ tasks = [], setTasks, onTaskClick, onQuickAddTask }) => {
  const { addToast } = useToast();

  const columns = [
    { id: 'Backlog', title: 'Backlog' },
    { id: 'Todo', title: 'To Do' },
    { id: 'In Progress', title: 'In Progress' },
    { id: 'Review', title: 'In Review' },
    { id: 'Completed', title: 'Completed' }
  ];

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    const newIndex = destination.index;

    // Optimistically update frontend state
    const updatedTasks = Array.from(tasks);
    const targetTaskIndex = updatedTasks.findIndex(t => t._id === draggableId);

    if (targetTaskIndex !== -1) {
      updatedTasks[targetTaskIndex] = {
        ...updatedTasks[targetTaskIndex],
        status: newStatus,
        orderPosition: newIndex
      };
      setTasks(updatedTasks);
    }

    // Persist changes to backend MongoDB
    try {
      await taskService.updateTaskStatus(draggableId, {
        status: newStatus,
        orderPosition: newIndex
      });
    } catch (err) {
      addToast('Failed to persist task drag position', 'error');
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[calc(100vh-220px)] select-none">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={colTasks}
              onTaskClick={onTaskClick}
              onQuickAddTask={onQuickAddTask}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};
