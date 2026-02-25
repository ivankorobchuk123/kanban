import { TaskVariant } from '@/app/store/types';

export interface StatusOption {
  id: string;
  label: string;
  variant: TaskVariant;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { id: 'in-progress', label: 'In Progress', variant: TaskVariant.SECONDARY },
  { id: 'new', label: 'New', variant: TaskVariant.GHOST },
  { id: 'need-test', label: 'Need Test', variant: TaskVariant.PRIMARY },
  { id: 'backlog', label: 'Backlog', variant: TaskVariant.BACKLOG },
  { id: 'done', label: 'Done', variant: TaskVariant.DONE },
  { id: 'canceled', label: 'Canceled', variant: TaskVariant.CANCELED },
  { id: 'blocked', label: 'Blocked', variant: TaskVariant.BLOCKED },
];


export const STATUS_OBJECTS: Record<string, StatusOption> = {
  'in-progress': STATUS_OPTIONS[0],
  'new': STATUS_OPTIONS[1],
  'need-test': STATUS_OPTIONS[2],
  'backlog': STATUS_OPTIONS[3],
  'done': STATUS_OPTIONS[4],
  'canceled': STATUS_OPTIONS[5],
  'blocked': STATUS_OPTIONS[6],
};