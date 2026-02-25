import type { TaskDto } from '@/shared/api/types/task.dto';
import { Card } from '@/widgets/card/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { TaskVariant } from '@/app/store/types';
import { NewTask } from '@/features/addTask/ui/NewTask';
import { useConfirm } from '@/shared/ui/ConfirmDialog';
import { useAppDispatch } from '@/shared/lib/hooks/redux';
import { deleteColumn } from '@/app/store/slices/tasksSlice';

import styles from './Column.module.scss';


interface ColumnProps {
  columnAlias: string;
  tasks: TaskDto[];
  variant: TaskVariant;
  title: string;
}

export function Column({ columnAlias, tasks, variant, title }: ColumnProps) {
  const confirm = useConfirm();
  const dispatch = useAppDispatch();
  const handleDeleteColumn = async () => {
    const ok = await confirm({
      title: 'Remove column?',
      message: 'Are you sure you want to remove this column?',
      confirmText: 'Remove',
      cancelText: 'Cancel',
    });
    if (ok) {
      dispatch(deleteColumn({ columnAlias }));
    }
  };
  return (
    <div className={`${styles.column} ${styles[variant]}`}>
      <div className={`${styles.wrapBadge} flex items-center justify-between`}>
        <div className="flex items-center">
          <Badge variant={variant}>{title}</Badge>
          <span className={styles.count}>{tasks.length}</span>
        </div>
        <div className="flex items-center">
          <button className={styles.icon} onClick={handleDeleteColumn}>
            <span className="material-icons-outlined">delete</span>
          </button>
        </div>
      </div>
      <div className={styles.cards}>
        {tasks.map((card) => (
          <Card
            key={card.id}
            card={card}
            title={card.title}
            taskNumber={`REC-${card.id}`}
            columnAlias={columnAlias}
          />
        ))}
      </div>
      <NewTask className={variant} columnAlias={columnAlias} />
    </div>
  );
}
