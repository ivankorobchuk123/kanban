import { useEffect, useRef } from 'react';

import { Badge } from '@/shared/ui/Badge';
import type { TaskVariant } from '@/app/store/types';

import styles from './StatusSelectDropdown.module.scss';

export interface StatusOption {
  id: string;
  label: string;
  variant: TaskVariant;
  color: string;
}

export interface StatusOptionGroup {
  label: string;
  options: StatusOption[];
}

interface StatusSelectDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  options?: StatusOption[];
  groups?: StatusOptionGroup[];
  selectedId?: string;
  onSelect: (status: StatusOption) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function StatusSelectDropdown({
  isOpen,
  onClose,
  options = [],
  groups,
  selectedId,
  onSelect,
  anchorRef,
}: StatusSelectDropdownProps) {
  const items = groups ?? [{ label: '', options }];
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
    <div ref={dropdownRef} className={styles.dropdown} role="listbox">
      {items.map((group, groupIdx) => (
        <div key={group.label || groupIdx} className={styles.group}>
          {group.label && (
            <div className={styles.groupLabel}>{group.label}</div>
          )}
          {group.options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={selectedId === option.id}
              className={`${styles.option} ${selectedId === option.id ? styles.selected : ''}`}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Badge variant={option.variant} color={option.color}>
                {option.label}
              </Badge>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
