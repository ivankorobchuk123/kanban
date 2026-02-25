import styles from './Badge.module.scss';



interface BadgeProps {
  children: React.ReactNode;
  variant: string;
  showDot?: boolean;
  className?: string;
  color?: string;
}

export function Badge({ children, variant, showDot = true, className = '', color }: BadgeProps) {
    return <div className={`${styles.badge} ${styles[variant]} ${className}`.trim()} 
    style={{ backgroundColor: color }}>
        <div className="flex items-center gap-1">
            {showDot && <div className={styles.dot} style={{ backgroundColor: color ? `color-mix(in srgb, ${color} 65%, black)` : undefined }}></div>}
            <span className={styles.badgeText} style={{ color: color ? `color-mix(in srgb, ${color} 35%, black)` : undefined }}>{children}</span>
        </div>
    </div>
}