import { type FC } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import styles from './column.module.css';
import { statusIcons, statusTitles } from '../../utils';
import type { ColumnProps } from '../../types';

const Column: FC<ColumnProps> = ({ status, tasks, deletingId, onDelete }) => {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.title}>{statusTitles[status]}</h2>
        <img src={statusIcons[status]} alt={status} />
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            className={`${styles.taskContainer} ${
              snapshot.isDraggingOver ? styles.draggingOver : ''
            }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 && (
              <div className={styles.noTask}>No tasks</div>
            )}
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    className={styles.task}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <button
                      className={styles.deleteButton}
                      onClick={(e) => onDelete(e, task.id)}
                      aria-label='Delete task'
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id ? (
                        <span
                          className={styles.deleteSpinner}
                          aria-label='Deleting'
                        />
                      ) : (
                        '×'
                      )}
                    </button>
                    {task.text}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export { Column };
