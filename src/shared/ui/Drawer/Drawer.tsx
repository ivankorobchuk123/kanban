import { useEffect, useState } from 'react';

import styles from './Drawer.module.scss';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsReadyToAnimate(true));
      });
      return () => cancelAnimationFrame(raf);
    }
    const id = setTimeout(() => setIsReadyToAnimate(false), 0);
    return () => clearTimeout(id);
  }, [isOpen]);

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

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const isVisible = isOpen && isReadyToAnimate;

  return (
    <>
      <div
        className={`${styles.overlay} ${isVisible ? styles.open : ''}`}
        onClick={handleOverlayClick}
        aria-hidden={!isOpen}
      />
      <div
        className={`${styles.panel} ${isVisible ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
}
