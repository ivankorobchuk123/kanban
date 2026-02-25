import type { TaskDto } from '@/shared/api/types/task.dto';
import { Card } from '@/widgets/card/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { TaskVariant } from '@/app/store/types';
import { NewTask } from '@/features/addTask/ui/NewTask';

import styles from './Column.module.scss';


interface ColumnProps {
  columnAlias: string;
  tasks: TaskDto[];
  variant: TaskVariant;
  title: string;
}

export function Column({
  columnAlias,
  tasks,
  variant,
  title,
}: ColumnProps) {


  return (
    <div className={`${styles.column} ${styles[variant]}`}>
        <div className={styles.wrapBadge}>
            <Badge variant={variant}>
                {title}
            </Badge>
            <span className={styles.count}>{tasks.length}</span>
        </div>
        <div className={styles.cards}>
        {
            tasks.map((card) => (
                <Card
                    key={card.id}
                    card={card}
                    title={card.title}
                    taskNumber={`REC-${card.id}`}
                    columnAlias={columnAlias}
                />
            ))
        }
        </div>
        <NewTask className={variant} columnAlias={columnAlias} />
    </div>
  )
}
