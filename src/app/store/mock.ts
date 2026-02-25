import type { StatusOption } from '@/app/store/statusOptions';
import { STATUS_OBJECTS } from '@/app/store/statusOptions';

export interface AssigneeOption {
  id: string | number;
  name: string;
  src: string;
}

export const mockUsers = [
  { id: '1', src: '/images/avatar-1.jpg', name: 'John Doe' },
  { id: '2', src: '/images/avatar-2.jpg', name: 'Anna Doe' },
  { id: '3', src: '/images/avatar-3.jpg', name: 'Mike Doe' },
] as AssigneeOption[];

export interface ColumnDto {
  alias: string;
  title: string;
  status: string;
  order: number;
}

export interface TaskEntity {
  id: number;
  columnAlias: string;
  order: number;
  title: string;
  comments: string;
  assignee: AssigneeOption;
  status: StatusOption;
}

export const mockColumns: ColumnDto[] = [
  { alias: 'new', title: 'New', status: STATUS_OBJECTS['new'].id, order: 0 },
  {
    alias: 'in-progress',
    title: 'In Progress',
    status: STATUS_OBJECTS['in-progress'].id,
    order: 1,
  },
  {
    alias: 'need-test',
    title: 'Need Test',
    status: STATUS_OBJECTS['need-test'].id,
    order: 2,
  },
  {
    alias: 'backlog',
    title: 'Backlog',
    status: STATUS_OBJECTS['backlog'].id,
    order: 3,
  },
];

export const mockTasks: TaskEntity[] = [
  {
    id: 1,
    columnAlias: 'new',
    order: 0,
    title: 'Обновить дизайн поп-апа на подписку',
    comments:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ips',
    assignee: mockUsers[0],
    status: STATUS_OBJECTS['new'],
  },
  {
    id: 2,
    columnAlias: 'new',
    order: 1,
    title: 'Обновить дизайн поп-апа на подписку 2',
    comments: '',
    assignee: mockUsers[1],
    status: STATUS_OBJECTS['new'],
  },
  {
    id: 3,
    columnAlias: 'in-progress',
    order: 0,
    title: 'BE - Migrate to AWS S3',
    comments: '',
    assignee: mockUsers[2],
    status: STATUS_OBJECTS['in-progress'],
  },
];
