
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


export { TaskVariant } from '@/shared/model/types';