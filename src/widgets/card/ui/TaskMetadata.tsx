import { Avatar } from '@/shared/ui/Avatar';

import styles from './TaskMetadata.module.scss';

interface TaskMetadataProps {
  taskNumber: string;
  url?: string;
  urlTitle?: string;
  lastEdited?: string;
  createdBy?: {
    name: string;
    avatarSrc?: string;
  };
}

export function TaskMetadata({
  taskNumber,
  url = 'localhost:3000/REC-20...',
  urlTitle,
  lastEdited = 'February 25, 2026 15:43',
  createdBy = {
    name: 'Ivan Korobchuk',
    avatarSrc: 'https://cdn.quasar.dev/img/boy-avatar.png',
  },
}: TaskMetadataProps) {
  return (
    <div className={`${styles.metaRow} flex justify-between`}>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>
          <span className="material-icons-outlined">numbers</span> ID
        </div>
        <div className={styles.metaValue}>{taskNumber}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>
          <span className="material-icons-outlined">link</span>
          URL
        </div>
        <div className={styles.metaValue} title={urlTitle ?? url}>
          {url}
        </div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>
          <span className="material-icons-outlined">schedule</span>
          Last edited time
        </div>
        <div className={styles.metaValue}>{lastEdited}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>
          <span className="material-icons-outlined">person_outline</span>
          Created
        </div>
        <div className={`${styles.metaValue} ${styles.metaCreator}`}>
          <Avatar
            src={createdBy.avatarSrc ?? 'https://cdn.quasar.dev/img/boy-avatar.png'}
            alt={createdBy.name}
            size="xs"
          />
          {createdBy.name}
        </div>
      </div>
    </div>
  );
}
