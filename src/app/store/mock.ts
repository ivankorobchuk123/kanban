import type { StatusOption } from '@/app/store/statusOptions';
import { INITIAL_STATUS_OBJECTS } from '@/app/store/statusOptions';
import type { TaskDto } from '@/shared/api/types/task.dto';
import type { AssigneeOption } from '@/shared/model/types';

export type { AssigneeOption };

export const mockUsers = [
  { id: '1', src: '/images/avatar-1.jpg', name: 'John Doe' },
  { id: '2', src: '/images/avatar-2.jpg', name: 'Anna Doe' },
  { id: '3', src: '/images/avatar-3.jpg', name: 'Mike Doe' },
] as AssigneeOption[];

export interface ColumnDto {
  alias: string;
  title: string;
  status: string;
  color: string;
  order: number;
  tasks: TaskDto[];
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
  {
    alias: 'new',
    title: 'New',
    status: INITIAL_STATUS_OBJECTS['new'].id,
    color: '#1c13011c',
    order: 0,
    tasks: [],
  },
  {
    alias: 'in-progress',
    title: 'In Progress',
    status: INITIAL_STATUS_OBJECTS['in-progress'].id,
    color: '#f1e0ba',
    order: 1,
    tasks: [],
  },
  {
    alias: 'need-test',
    title: 'Need Test',
    status: INITIAL_STATUS_OBJECTS['need-test'].id,
    color: '#cadef6',
    order: 2,
    tasks: [],
  },
];

export const mockTasks: TaskEntity[] = [
  {
    id: 1,
    columnAlias: 'new',
    order: 0,
    title: 'Lorem Ipsum is simply dummy text of',
    comments:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ips',
    assignee: mockUsers[0],
    status: INITIAL_STATUS_OBJECTS['new'],
  },
  {
    id: 2,
    columnAlias: 'new',
    order: 1,
    title: 'Lorem Ipsum is simply dummy text of 2',
    comments: '',
    assignee: mockUsers[1],
    status: INITIAL_STATUS_OBJECTS['new'],
  },
  {
    id: 3,
    columnAlias: 'in-progress',
    order: 0,
    title: 'BE - Migrate to AWS S3',
    comments: '',
    assignee: mockUsers[2],
    status: INITIAL_STATUS_OBJECTS['in-progress'],
  },
];
