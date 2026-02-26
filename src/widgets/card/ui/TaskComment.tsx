import { useEffect, useRef, useState } from 'react';

import styles from './TaskComment.module.scss';

interface TaskCommentProps {
  text: string;
  onSave: (text: string) => void;
  placeholder?: string;
}

export function TaskComment({
  text,
  onSave,
  placeholder = 'Add a comment...',
}: TaskCommentProps) {
  const [localValue, setLocalValue] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const value = localValue ?? text;

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, 60)}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleBlur = () => {
    const trimmed = value.trim();
    if (trimmed !== text) {
      onSave(trimmed);
    }
    setLocalValue(null);
  };

  return (
    <div className={styles.comment}>
        
      <textarea
        ref={textareaRef}
        className={styles.commentText}
        value={value}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={1}
      />
    </div>
  );
}
