import { describe, it, expect } from 'vitest';
import {
  getNextTaskId,
  findTaskById,
  createNewTask,
} from './tasksSlice.helpers';
import type { StatusOption } from '@/app/store/statusOptions';
import { TaskVariant } from '@/app/store/types';

const mockStatus: StatusOption = {
  id: 'new',
  label: 'New',
  variant: TaskVariant.GHOST,
  color: '#ccc',
};

describe('getNextTaskId', () => {
  it('returns 1 for empty array', () => {
    expect(getNextTaskId([])).toBe(1);
  });

  it('returns max id + 1', () => {
    expect(getNextTaskId([{ id: 3 }, { id: 1 }, { id: 5 }])).toBe(6);
  });

  it('handles items without id', () => {
    expect(getNextTaskId([{ id: undefined }, { id: 2 }])).toBe(3);
  });
});

describe('findTaskById', () => {
  const tasks = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('finds task by numeric string', () => {
    expect(findTaskById(tasks, '2')).toEqual({ id: 2 });
  });

  it('finds task when id is number', () => {
    expect(findTaskById(tasks, '1')).toEqual({ id: 1 });
  });

  it('returns undefined when not found', () => {
    expect(findTaskById(tasks, '99')).toBeUndefined();
  });
});

describe('createNewTask', () => {
  it('creates task with correct shape', () => {
    const task = createNewTask({
      id: 10,
      title: 'Test task',
      columnAlias: 'new',
      order: 2,
      status: mockStatus,
    });

    expect(task.id).toBe(10);
    expect(task.title).toBe('Test task');
    expect(task.columnAlias).toBe('new');
    expect(task.order).toBe(2);
    expect(task.status).toBe(mockStatus);
    expect(task.comments).toBe('');
  });
});
