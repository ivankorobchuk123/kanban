
export interface Task {
  id: string
  columnId: string
  text: string
  completed: boolean
  order: number
}

export interface Column {
  id: string
  title: string
  order: number
}

export type TaskFilter = 'all' | 'completed' | 'incomplete'


export enum TaskVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  BACKLOG = 'backlog',
  GHOST = 'ghost',
  DONE = 'done',
  CANCELED = 'canceled',
  BLOCKED = 'blocked',
}