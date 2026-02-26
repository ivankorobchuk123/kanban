import styles from './Sidebar.module.scss';

const NAV_ITEMS = [
  { icon: 'home', label: 'Home' },
  { icon: 'check_circle', label: 'My Tasks', active: false },
  { icon: 'inbox', label: 'Inbox', badge: 3 },
  { icon: 'calendar_month', label: 'Calendar' },
  { icon: 'bar_chart', label: 'Reports' },
];

const PROJECTS = [
  { id: 1, name: 'Rec: Tasks', color: '#6366f1', active: true },
  { id: 2, name: 'Marketing Site', color: '#10b981' },
  { id: 3, name: 'Mobile App', color: '#f59e0b' },
  { id: 4, name: 'Design System', color: '#ec4899' },
];

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.workspace}>
        <div className={styles.workspaceIcon}>R</div>
        <div className={styles.workspaceInfo}>
          <div className={styles.workspaceName}>Rec Studio</div>
          <div className={styles.workspacePlan}>Free plan</div>
        </div>
        <button type="button" className={styles.chevron}>
          <span className="material-icons-outlined" style={{ fontSize: 18 }}>unfold_more</span>
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <button type="button" key={item.label} className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}>
            <span className="material-icons-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
            {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
          </button>
        ))}
      </nav>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Projects</span>
          <button type="button" className={styles.addBtn}>
            <span className="material-icons-outlined" style={{ fontSize: 18 }}>add</span>
          </button>
        </div>
        {PROJECTS.map((project) => (
          <button type="button" key={project.id} className={`${styles.projectItem} ${project.active ? styles.projectItemActive : ''}`}>
            <span className={styles.projectDot} style={{ background: project.color }} />
            <span className={styles.projectName}>{project.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.bottom}>
        <button type="button" className={styles.navItem}>
          <span className="material-icons-outlined" style={{ fontSize: 20 }}>settings</span>
          <span className={styles.navLabel}>Settings</span>
        </button>
        <div className={styles.user}>
          <div className={styles.userAvatar}>JD</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>John Doe</div>
            <div className={styles.userEmail}>john@rec.studio</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
