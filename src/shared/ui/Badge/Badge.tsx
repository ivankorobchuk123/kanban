import styles from './Badge.module.scss';
import type { TaskVariant } from '@/app/store/types';


interface BadgeProps {
  children: React.ReactNode;
  variant: TaskVariant;
}

export function Badge({ children, variant }: BadgeProps) {
    return <div className={`${styles.badge} ${styles[variant]}`}>
        <div className="flex items-center gap-1">
            <div className={styles.dot}></div>
            <span className={styles.badgeText}>{children}</span>
        </div>
    </div>
}