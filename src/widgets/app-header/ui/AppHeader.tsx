import styles from './AppHeader.module.scss';

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.breadcrumb}>
        <span className={styles.workspace}>Rec data</span>
        <span className={styles.separator}>
          <span className="material-icons-outlined" style={{ fontSize: 16 }}>chevron_right</span>
        </span>
        <span className={styles.page}>Rec: Tasks</span>
      </div>

<div className={styles.actions}>
        <button type="button" className={styles.iconBtn}>
          <span className="material-icons-outlined" style={{ fontSize: 20 }}>notifications_none</span>
          <span className={styles.dot} />
        </button>
        <button type="button" className={styles.iconBtn}>
          <span className="material-icons-outlined" style={{ fontSize: 20 }}>help_outline</span>
        </button>
        <div className={styles.avatar}>JD</div>
      </div>
    </header>
  );
}
