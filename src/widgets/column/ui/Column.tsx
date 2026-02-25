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
  onTaskTitleChange?: (columnAlias: string, taskId: string, newTitle: string) => void;
}

export function Column({ columnAlias, tasks, variant, title, onTaskTitleChange }: ColumnProps) {


  return (
    <div className={`${styles.column} ${styles[variant]}`}>
        <div className={styles.wrapBadge}>
            <Badge variant={variant}>
                {title}
            </Badge>
            <span></span>
        </div>
        <div className={styles.cards}>
        {
            tasks.map((card) => (
                <Card
                    key={card.id}
                    title={card.title}
                    onTitleChange={
                        onTaskTitleChange
                            ? (newTitle) => onTaskTitleChange(columnAlias, String(card.id), newTitle)
                            : undefined
                    }
                />
            ))
        }
        </div>
        <NewTask className={variant} />
    </div>
  )
}
