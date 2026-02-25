import { useEffect, useRef, useState } from 'react';

import { Avatar } from '@/shared/ui/Avatar';
import { TaskDrawer } from '@/widgets/card/ui/TaskDrawer';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { updateTaskTitle, removeTask } from '@/app/store/slices/tasksSlice';

import styles from '@/widgets/card/ui/Card.module.scss';
import type { TaskDto } from '@/shared/api/types/task.dto';

interface CardProps {
  card: TaskDto;
  title: string;
  taskNumber?: string;
  columnAlias: string;
}

export function Card({
  title,
  taskNumber = 'REC-1987',
  card,
  columnAlias,
}: CardProps) {
  const dispatch = useAppDispatch();
  const taskId = String(card.id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const adjustTextareaHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (isEditing) {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
        adjustTextareaHeight();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [editValue]);

  const handleEdit = () => {
    setEditValue(title);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const newTitle = editValue.trim();
    if (newTitle && newTitle !== title) {
      dispatch(updateTaskTitle({ columnAlias, taskId, newTitle }));
    } else {
      setEditValue(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(removeTask({ columnAlias, taskId }));
  };

  const openDrawer = () => {
    if (!isEditing) setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <div
        className={`${styles.card} ${isDrawerOpen && styles.active}`}
        onClick={openDrawer}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openDrawer()}
      >
        <div className={styles.cardContent}>
          <div
            className={`${styles.configCard} ${isEditing && styles.noHover} flex items-center justify-between`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.editIcon} ${styles.icon}`}
              onClick={handleEdit}
            >
              <span className="material-icons-outlined">edit</span>
            </div>
            <div
              className={`${styles.deleteIcon} ${styles.icon}`}
              onClick={handleDelete}
            >
              <span className="material-icons-outlined">delete</span>
            </div>
          </div>
          <div
            className={`${styles.title} flex`}
            onClick={(e) => isEditing && e.stopPropagation()}
          >
            <div className={styles.icon}>📍</div>
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Type name"
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={styles.titleInput}
                rows={1}
              />
            ) : (
              <div className={styles.titleText}>{title}</div>
            )}
          </div>
          <div className={styles.taskNumber}>{taskNumber}</div>
          <div className={styles.user}>
            <Avatar
              src={card.assignee?.src ?? '/images/avatar-1.jpg'}
              alt={card.assignee?.name ?? 'User Avatar'}
              size="xs"
            />
            <div className={styles.userName}>{card.assignee?.name ?? 'John Doe'}</div>
          </div>
        </div>
      </div>

      <TaskDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        taskNumber={taskNumber}
        task={card}
        columnAlias={columnAlias}
      />
    </>
  );
}
