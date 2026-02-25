import type { ButtonHTMLAttributes } from 'react';

import styles from './EditButton.module.scss';

interface EditButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export function EditButton({
  className = '',
  ...props
}: EditButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.editButton} ${className}`.trim()}
      {...props}
    >
      <span className="material-icons-outlined">edit</span>
    </button>
  );
}
