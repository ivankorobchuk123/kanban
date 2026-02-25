import { Avatar } from '@/shared/ui/Avatar';

import styles from '@/widgets/card/ui/Card.module.scss';

interface CardProps {
  title: string;
}

export function Card({ title }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={`${styles.title} flex`}>
          <div className={styles.icon}>📍</div>
          <span>{title}</span>
        </div>
        <div className={styles.taskNumber}>
            RAC-1987
        </div>
        <div className={styles.user}>
            <Avatar
              src="https://cdn.quasar.dev/img/boy-avatar.png"
              alt="User Avatar"
              size="xs"
            />
            <div className={styles.userName}>
                John Doe
            </div>
        </div>
      </div>
    </div>
  );
}
