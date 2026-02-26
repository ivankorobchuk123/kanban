export const TaskVariant = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DANGER: 'danger',
  BACKLOG: 'backlog',
  GHOST: 'ghost',
  DONE: 'done',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  BLOCKED: 'blocked',
} as const;

export type TaskVariant = (typeof TaskVariant)[keyof typeof TaskVariant];

export interface AssigneeOption {
  id: string | number;
  name: string;
  src: string;
}
