import { useMemo } from 'react';
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
  const { data: todos = [], isLoading, error } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const toDoTasks = useMemo(
    () => todos.filter((task) => task.status === 'to do'),
    [todos]
  );
  const doingTasks = useMemo(
    () => todos.filter((task) => task.status === 'doing'),
    [todos]
  );
  const doneTasks = useMemo(
    () => todos.filter((task) => task.status === 'done'),
    [todos]
  );

  const columns = {
    'to do': toDoTasks,
    doing: doingTasks,
    done: doneTasks,
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    try {
      await updateTodo({ id: draggableId, status: newStatus }).unwrap();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();

    deleteTodo(id).catch((err) => console.error('Failed to delete task', err));
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
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default MainPage;
