import { useState, useEffect, useCallback } from 'react';

import styles from './AddColumnPopup.module.scss';

const DEFAULT_COLOR = '#94a3b8';

interface AddColumnPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, color: string) => void;
}

export function AddColumnPopup({ isOpen, onClose, onSubmit }: AddColumnPopupProps) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  const resetForm = useCallback(() => {
    setTitle('');
    setColor(DEFAULT_COLOR);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (trimmed) {
      onSubmit(trimmed, color);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${styles.open}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-column-title"
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <h2 id="add-column-title" className={styles.title}>
              New column
            </h2>
            <div className={styles.field}>
              <label htmlFor="column-name" className={styles.label}>
                Status name
              </label>
              <input
                id="column-name"
                type="text"
                className={styles.input}
                placeholder="e.g. In Review"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="column-color" className={styles.label}>
                Color
              </label>
              <div className={styles.colorRow}>
                <input
                  id="column-color"
                  type="color"
                  className={styles.colorInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className={styles.colorValue}>{color}</span>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.cancel}`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.confirm}`}>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
