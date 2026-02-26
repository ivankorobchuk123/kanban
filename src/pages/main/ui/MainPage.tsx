import { TaskBoard } from '@/widgets/task-board';
import { Sidebar } from '@/widgets/sidebar';
import { AppHeader } from '@/widgets/app-header';
import styles from './MainPage.module.scss';

export function MainPage() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightColumn}>
        <AppHeader />
        <main className={styles.main}>
          <div className={styles.content}>
            <TaskBoard />
          </div>
        </main>
      </div>
    </div>
  );
}
