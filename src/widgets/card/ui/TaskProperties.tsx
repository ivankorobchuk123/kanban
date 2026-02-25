import { useRef, useState } from 'react';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { EditButton } from '@/shared/ui/EditButton';
import {
  AssigneeSelectDropdown,
  type AssigneeOption,
} from '@/shared/ui/AssigneeSelectDropdown';
import {
  StatusSelectDropdown,
  type StatusOption,
} from '@/shared/ui/StatusSelectDropdown';
import { TaskVariant } from '@/app/store/types';
import { STATUS_OPTIONS } from '@/app/store/statusOptions';
import { mockUsers } from '@/app/store/mock';

import styles from './TaskProperties.module.scss';

interface TaskPropertiesProps {
  assignee?: AssigneeOption;
  users?: AssigneeOption[];
  onAssigneeChange?: (assignee: AssigneeOption) => void;
  status?: StatusOption;
  onStatusChange?: (status: StatusOption) => void;
}

export function TaskProperties({
  assignee,
  users = mockUsers as unknown as AssigneeOption[],
  onAssigneeChange,
  status,
  onStatusChange,
}: TaskPropertiesProps) {
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const executorRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const handleAssigneeClick = () => {
    setIsAssigneeOpen((prev) => !prev);
    setIsStatusOpen(false);
  };

  const handleStatusClick = () => {
    setIsStatusOpen((prev) => !prev);
    setIsAssigneeOpen(false);
  };

  const handleAssigneeSelect = (user: AssigneeOption) => {
    onAssigneeChange?.(user);
    setIsAssigneeOpen(false);
  };

  const handleStatusSelect = (s: StatusOption) => {
    onStatusChange?.(s);
    setIsStatusOpen(false);
  };

  return (
    <div className={styles.propertiesList}>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">person_outline</span>
          Executor
        </div>
        <div
          ref={executorRef}
          className={`${styles.propertyValue} ${styles.propertyExecutor} ${styles.executorWrapper}`}
          onClick={handleAssigneeClick}
        >
          <div className="flex items-center gap-2">
            <Avatar
              src={assignee?.src ?? ''}
              alt={assignee?.name ?? ''}
              size="xs"
              className={styles.executorAvatar}
            />
            <span>{assignee?.name ?? '—'}</span>
          </div>
          <EditButton onClick={handleAssigneeClick} />
          <AssigneeSelectDropdown
            isOpen={isAssigneeOpen}
            onClose={() => setIsAssigneeOpen(false)}
            users={users}
            selectedId={String(assignee?.id ?? '')}
            onSelect={handleAssigneeSelect}
            anchorRef={executorRef}
          />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">more_vert</span>
          Status
        </div>
        <div
          ref={statusRef}
          className={`${styles.propertyValue} ${styles.statusWrapper}`}
          onClick={handleStatusClick}
        >
          <Badge variant={status?.variant ?? TaskVariant.GHOST}>{status?.label ?? '—'}</Badge>
          <EditButton
            onClick={(e) => {
              e.stopPropagation();
              handleStatusClick();
            }}
          />
          <StatusSelectDropdown
            isOpen={isStatusOpen}
            onClose={() => setIsStatusOpen(false)}
            options={STATUS_OPTIONS}
            selectedId={status?.id ?? ''}
            onSelect={handleStatusSelect}
            anchorRef={statusRef}
          />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">person_add</span>
          Participant
        </div>
        <div className={styles.propertyValueEmpty}>Empty</div>
      </div>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">groups</span>
          Team
        </div>
        <div className={styles.propertyValueEmpty}>Empty</div>
      </div>

      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">calendar_today</span>
          Deadline
        </div>
        <div className={styles.propertyValueEmpty}>Empty</div>
      </div>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">description</span>
          Task Type
        </div>
        <div className={styles.propertyValueEmpty}>Empty</div>
      </div>
    </div>
  );
}
