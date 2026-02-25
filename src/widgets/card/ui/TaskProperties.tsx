import { useRef, useState } from 'react';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { EditButton } from '@/shared/ui/EditButton';
import {
  AssigneeSelectDropdown,
  type AssigneeOption,
} from '@/shared/ui/AssigneeSelectDropdown';
import { TaskVariant } from '@/app/store/types';
import { mockUsers } from '@/app/store/mock';

import styles from './TaskProperties.module.scss';

interface TaskPropertiesProps {
  assignee?: AssigneeOption;
  users?: AssigneeOption[];
  onAssigneeChange?: (assignee: AssigneeOption) => void;
  status?: string;
  statusVariant?: TaskVariant;
}

export function TaskProperties({
  assignee = mockUsers[0],
  users = mockUsers as unknown as AssigneeOption[],
  onAssigneeChange,
  status = 'Accepted',
  statusVariant = TaskVariant.SECONDARY,
}: TaskPropertiesProps) {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const executorRef = useRef<HTMLDivElement>(null);

  const handleAssigneeClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (user: AssigneeOption) => {
    onAssigneeChange?.(user);
    setIsDropdownOpen(false);
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
              src={assignee.src}
              alt={assignee.name}
              size="xs"
              className={styles.executorAvatar}
            />
            <span>{assignee.name}</span>
          </div>
          <EditButton
            onClick={handleAssigneeClick}
          />
          <AssigneeSelectDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            users={users}
            selectedId={assignee.id}
            onSelect={handleSelect}
            anchorRef={executorRef}
          />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <div className={styles.propertyLabel}>
          <span className="material-icons-outlined">more_vert</span>
          Status
        </div>
        <div className={styles.propertyValue}>
          <Badge variant={statusVariant}>{status}</Badge>
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
