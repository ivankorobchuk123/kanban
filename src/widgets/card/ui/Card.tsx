import { useCallback, useEffect, useRef, useState } from 'react';

import { Avatar } from '@/shared/ui/Avatar';
import { useConfirm } from '@/shared/ui/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/redux';
import {
  updateTaskTitle,
  removeTask,
  setActiveTask,
  toggleTaskSelection,
} from '@/app/store/slices/tasksSlice';
import { useTaskDraggable } from '@/shared/lib/dnd/useTaskDraggable';
import { useTaskDropTarget } from '@/shared/lib/dnd/useTaskDropTarget';
import type { TaskDropParams } from '@/shared/lib/dnd/useTaskDropTarget';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';

import styles from '@/widgets/card/ui/Card.module.scss';
import type { TaskDto } from '@/shared/api/types/task.dto';

interface CardProps {
  card: TaskDto;
  title: string;
  taskNumber?: string;
  columnAlias: string;
  dropTargetIndex?: number;
  onTaskDrop?: (params: TaskDropParams) => void;
}

export function Card({
  title,
  taskNumber = 'REC-1',
  card,
  columnAlias,
  dropTargetIndex,
  onTaskDrop,
}: CardProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const confirm = useConfirm();
  const taskId = String(card.id);
  const activeTaskId = useAppSelector((state) => state.tasks.activeTaskId);
  const selectedTaskIds = useAppSelector((state) => state.tasks.selectedTaskIds);
  const isDrawerOpen = activeTaskId === taskId;
  const isSelected = selectedTaskIds.includes(taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [closestEdge, setClosestEdge] = useState<'top' | 'bottom' | null>(null);

  const handleClosestEdgeChange = useCallback(
    (edge: 'top' | 'right' | 'bottom' | 'left' | null) => {
      setClosestEdge(edge === 'top' || edge === 'bottom' ? edge : null);
    },
    []
  );

  useTaskDraggable(cardRef, cardRef, taskId, columnAlias);
  useTaskDropTarget(
    cardRef,
    columnAlias,
    dropTargetIndex ?? 0,
    onTaskDrop ?? (() => {}),
    {
      onClosestEdgeChange: handleClosestEdgeChange,
      excludeTaskId: taskId,
    }
  );

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

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Remove task?',
      message: 'Are you sure you want to remove this task?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });
    if (ok) {
      dispatch(removeTask({ columnAlias, taskId }));
    }
  };

  const openDrawer = () => {
    if (!isEditing) dispatch(setActiveTask(taskId));
  };

  const handleCardClick = () => {
    if (!isEditing) dispatch(toggleTaskSelection(taskId));
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`${styles.card} ${isDrawerOpen ? styles.active : ''} ${isSelected ? styles.selected : ''}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        style={{ position: 'relative' }}
      >
        {closestEdge && <DropIndicator edge={closestEdge} gap="4px" />}
        <div className={styles.cardContent}>
          <div
            className={`${styles.configCard} ${isEditing && styles.noHover} flex items-center justify-between`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`${styles.icon}`}
              onClick={openDrawer}
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
            <div className={styles.userName}>
              {card.assignee?.name ?? 'John Doe'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}