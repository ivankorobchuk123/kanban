import { useEffect, useRef, useState } from 'react';

import { Avatar } from '@/shared/ui/Avatar';

import styles from '@/widgets/card/ui/Card.module.scss';

interface CardProps {
  title: string;
  onTitleChange?: (newTitle: string) => void;
}

export function Card({ title, onTitleChange }: CardProps) {
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
            onTitleChange?.(newTitle);
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

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.editIcon} onClick={handleEdit}>
        <span className="material-icons-outlined">edit</span>
        </div>
        <div className={`${styles.title} flex`}>
          <div className={styles.icon}>📍</div>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={styles.titleInput}
              rows={1}
            />
          ) : (
            <div className={styles.titleText}>
              {title}
            </div>
          )}
        </div>
        <div className={styles.taskNumber}>RAC-1987</div>
        <div className={styles.user}>
          <Avatar
            src="https://cdn.quasar.dev/img/boy-avatar.png"
            alt="User Avatar"
            size="xs"
          />
          <div className={styles.userName}>John Doe</div>
        </div>
      </div>
    </div>
  );
}
