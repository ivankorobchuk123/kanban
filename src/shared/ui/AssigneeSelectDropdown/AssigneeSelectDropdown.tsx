import { useEffect, useRef } from 'react';

import { Avatar } from '@/shared/ui/Avatar';

import styles from './AssigneeSelectDropdown.module.scss';
import type { AssigneeOption } from '@/shared/model/types';

interface AssigneeSelectDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  users: AssigneeOption[];
  selectedId?: string;
  onSelect: (user: AssigneeOption) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function AssigneeSelectDropdown({
  isOpen,
  onClose,
  users,
  selectedId,
  onSelect,
  anchorRef,
}: AssigneeSelectDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className={styles.dropdown} >
      {users.map((user) => (
        <button
          key={user.id}
          type="button"
          aria-selected={selectedId === user.id}
          className={`${styles.option} ${selectedId === user.id ? styles.selected : ''}`}
          onClick={() => {
            onSelect(user);
            onClose();
          }}
        >
          <Avatar
            src={user.src}
            alt={user.name}
            size="xs"
          />
          <span>{user.name}</span>
        </button>
      ))}
    </div>
  );
}
