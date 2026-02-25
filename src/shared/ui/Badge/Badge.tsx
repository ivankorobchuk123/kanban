import styles from './Badge.module.scss';



interface BadgeProps {
  children: React.ReactNode;
  variant: string;
  showDot?: boolean;
  className?: string;
}

export function Badge({ children, variant, showDot = true, className = '' }: BadgeProps) {
    return <div className={`${styles.badge} ${styles[variant]} ${className}`.trim()}>
        <div className="flex items-center gap-1">
            {showDot && <div className={styles.dot}></div>}
            <span className={styles.badgeText}>{children}</span>
        </div>
    </div>
}