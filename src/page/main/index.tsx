import { useEffect, useMemo, useState } from 'react';
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useUpdateTodoMutation,
} from '../../services/todoApi';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';
import styles from './main.module.css';
import { Column } from '../../components';

const MainPage = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data, isLoading, error } = useGetTodosQuery();
  const [todos, setTodos] = useState(data || []);
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  useEffect(() => {
    if (data) setTodos(data);
  }, [data]);

  const columns = useMemo(
    () => ({
      'to do': todos.filter((task) => task.status === 'to do'),
      doing: todos.filter((task) => task.status === 'doing'),
      done: todos.filter((task) => task.status === 'done'),
    }),
    [todos]
  );

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setTodos((prevTodos) => {
      const updated = [...prevTodos];
      const draggedTaskIndex = updated.findIndex(
        (task) => task.id === draggableId
      );
      const draggedTask = updated[draggedTaskIndex];

      updated.splice(draggedTaskIndex, 1);

      const newTask = {
        ...draggedTask,
        status: destination.droppableId,
      };

      const sameStatusTasks = updated.filter(
        (task) => task.status === destination.droppableId
      );

      const beforeInsertId = sameStatusTasks[destination.index]?.id ?? null;

      const insertIndex = beforeInsertId
        ? updated.findIndex((task) => task.id === beforeInsertId)
        : updated.length;

      updated.splice(insertIndex, 0, newTask);
      return updated;
    });

    try {
      await updateTodo({
        id: draggableId,
        status: destination.droppableId,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setDeletingId(id);
      await deleteTodo(id).unwrap();
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <div
        className={styles.loader}
        aria-label='Loading spinner'
        role='status'
      />
    );

  if (error)
    return (
      <div className={styles.errorMessage} role='alert'>
        Error loading tasks. Please try refreshing the page.
      </div>
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.wrapper}>
        {Object.entries(columns).map(([status, tasks]) => (
          <Column
            key={status}
            status={status}
            tasks={tasks}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default MainPage;
