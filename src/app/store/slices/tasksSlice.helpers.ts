import { mockUsers } from '@/app/store/mock';
import type { StatusOption } from '@/app/store/statusOptions';

type TaskWithId = { id?: number };

export function getNextTaskId(tasks: TaskWithId[]): number {
  const maxId = tasks.reduce((max, t) => Math.max(max, t.id ?? 0), 0);
  return maxId + 1;
}

export function findTaskById<T extends { id?: number }>(
  tasks: T[],
  taskId: string
): T | undefined {
  return tasks.find((t) => String(t.id) === String(taskId));
}

export function createNewTask(params: {
  id: number;
  title: string;
  columnAlias: string;
  order: number;
  status: StatusOption;
}) {
  return {
    id: params.id,
    columnAlias: params.columnAlias,
    order: params.order,
    title: params.title,
    comments: '',
    assignee: mockUsers[0],
    status: params.status,
  };
}
