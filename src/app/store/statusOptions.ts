import { TaskVariant } from '@/app/store/types';

export interface StatusOption {
  id: string;
  label: string;
  variant: TaskVariant;
  color: string;
}

export const INITIAL_STATUS_OBJECTS: Record<string, StatusOption> = {
  'in-progress': { id: 'in-progress', label: 'In Progress', variant: TaskVariant.SECONDARY, color: '#f1e0ba' },
  'new': { id: 'new', label: 'New', variant: TaskVariant.GHOST, color: '#1c13011c' },
  'need-test': { id: 'need-test', label: 'Need Test', variant: TaskVariant.PRIMARY, color: '#cadef6' },
  'backlog': { id: 'backlog', label: 'Backlog', variant: TaskVariant.BACKLOG, color: '#e7d8d2' },
  'done': { id: 'done', label: 'Done', variant: TaskVariant.DONE, color: '#c7e9c0' },
  'canceled': { id: 'canceled', label: 'Canceled', variant: TaskVariant.CANCELED, color: '#e4e4e4' },
  'blocked': { id: 'blocked', label: 'Blocked', variant: TaskVariant.BLOCKED, color: '#ffcdd2' },
};