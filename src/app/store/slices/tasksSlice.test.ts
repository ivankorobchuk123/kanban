import { describe, it, expect } from 'vitest';
import tasksReducer, {
  addTask,
  removeTask,
  archiveTasks,
  moveTask,
  setSearchQuery,
  setStatusFilter,
  toggleShowCompleted,
  toggleTaskSelection,
  clearTaskSelection,
} from './tasksSlice';
import type { StatusOption } from '@/app/store/statusOptions';
import { TaskVariant } from '@/app/store/types';

const mockStatus: StatusOption = {
  id: 'new',
  label: 'New',
  variant: TaskVariant.GHOST,
  color: '#ccc',
};

const inProgressStatus: StatusOption = {
  id: 'in-progress',
  label: 'In Progress',
  variant: TaskVariant.SECONDARY,
  color: '#f1e0ba',
};

const emptyState = {
  tasks: [],
  activeTaskId: null,
  searchQuery: '',
  statusFilterIds: null,
  selectedTaskIds: [],
  archivedTasks: [],
  showCompleted: false,
};

const makeTask = (id: number, columnAlias = 'new', order = 0) => ({
  id,
  columnAlias,
  order,
  title: `Task ${id}`,
  comments: '',
  assignee: { id: '1', name: 'John', src: '' },
  status: mockStatus,
});

describe('tasksSlice', () => {
  describe('addTask', () => {
    it('adds a task to empty column with order 0', () => {
      const state = tasksReducer(
        emptyState,
        addTask({ columnAlias: 'new', title: 'Hello', status: mockStatus })
      );
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].title).toBe('Hello');
      expect(state.tasks[0].columnAlias).toBe('new');
      expect(state.tasks[0].order).toBe(0);
    });

    it('assigns order after existing tasks in column', () => {
      const stateWithTask = {
        ...emptyState,
        tasks: [makeTask(1, 'new', 0), makeTask(2, 'new', 1)],
      };
      const state = tasksReducer(
        stateWithTask,
        addTask({ columnAlias: 'new', title: 'Third', status: mockStatus })
      );
      const newTask = state.tasks.find((t) => t.title === 'Third');
      expect(newTask?.order).toBe(2);
    });

    it('uses default title "New task" when not provided', () => {
      const state = tasksReducer(
        emptyState,
        addTask({ columnAlias: 'new', status: mockStatus })
      );
      expect(state.tasks[0].title).toBe('New task');
    });
  });

  describe('removeTask', () => {
    it('removes the task by id', () => {
      const stateWithTasks = {
        ...emptyState,
        tasks: [makeTask(1), makeTask(2), makeTask(3)],
      };
      const state = tasksReducer(
        stateWithTasks,
        removeTask({ columnAlias: 'new', taskId: '2' })
      );
      expect(state.tasks).toHaveLength(2);
      expect(state.tasks.find((t) => t.id === 2)).toBeUndefined();
    });

    it('clears activeTaskId when the active task is removed', () => {
      const stateWithActive = {
        ...emptyState,
        tasks: [makeTask(5)],
        activeTaskId: '5',
      };
      const state = tasksReducer(
        stateWithActive,
        removeTask({ columnAlias: 'new', taskId: '5' })
      );
      expect(state.activeTaskId).toBeNull();
    });

    it('keeps activeTaskId when a different task is removed', () => {
      const stateWithActive = {
        ...emptyState,
        tasks: [makeTask(1), makeTask(2)],
        activeTaskId: '1',
      };
      const state = tasksReducer(
        stateWithActive,
        removeTask({ columnAlias: 'new', taskId: '2' })
      );
      expect(state.activeTaskId).toBe('1');
    });
  });

  describe('archiveTasks', () => {
    it('moves tasks to archivedTasks', () => {
      const stateWithTasks = {
        ...emptyState,
        tasks: [makeTask(1), makeTask(2), makeTask(3)],
      };
      const state = tasksReducer(
        stateWithTasks,
        archiveTasks({ taskIds: ['1', '2'], archiveStatus: 'completed' })
      );
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe(3);
      expect(state.archivedTasks).toHaveLength(2);
      expect(state.archivedTasks[0].archiveStatus).toBe('completed');
    });

    it('stores original task data in archive', () => {
      const task = makeTask(10, 'new', 0);
      const stateWithTask = { ...emptyState, tasks: [task] };
      const state = tasksReducer(
        stateWithTask,
        archiveTasks({ taskIds: ['10'], archiveStatus: 'canceled' })
      );
      expect(state.archivedTasks[0].task.id).toBe(10);
      expect(state.archivedTasks[0].archiveStatus).toBe('canceled');
    });

    it('clears selectedTaskIds for archived tasks', () => {
      const stateWithSelected = {
        ...emptyState,
        tasks: [makeTask(1), makeTask(2)],
        selectedTaskIds: ['1', '2'],
      };
      const state = tasksReducer(
        stateWithSelected,
        archiveTasks({ taskIds: ['1'], archiveStatus: 'completed' })
      );
      expect(state.selectedTaskIds).toEqual(['2']);
    });
  });

  describe('moveTask (same column)', () => {
    it('reorders tasks within the same column', () => {
      const stateWithTasks = {
        ...emptyState,
        tasks: [makeTask(1, 'new', 0), makeTask(2, 'new', 1), makeTask(3, 'new', 2)],
      };
      const state = tasksReducer(
        stateWithTasks,
        moveTask({
          taskId: '1',
          fromColumnAlias: 'new',
          toColumnAlias: 'new',
          targetIndex: 2,
          status: mockStatus,
        })
      );
      const sorted = state.tasks.slice().sort((a, b) => a.order - b.order);
      expect(sorted.map((t) => t.id)).toEqual([2, 3, 1]);
    });

    it('does nothing when moving to same index', () => {
      const tasks = [makeTask(1, 'new', 0), makeTask(2, 'new', 1)];
      const stateWithTasks = { ...emptyState, tasks };
      const state = tasksReducer(
        stateWithTasks,
        moveTask({
          taskId: '1',
          fromColumnAlias: 'new',
          toColumnAlias: 'new',
          targetIndex: 0,
          status: mockStatus,
        })
      );
      expect(state.tasks).toEqual(stateWithTasks.tasks);
    });
  });

  describe('moveTask (cross column)', () => {
    it('moves task to a different column and updates status', () => {
      const stateWithTasks = {
        ...emptyState,
        tasks: [makeTask(1, 'new', 0)],
      };
      const state = tasksReducer(
        stateWithTasks,
        moveTask({
          taskId: '1',
          fromColumnAlias: 'new',
          toColumnAlias: 'in-progress',
          targetIndex: 0,
          status: inProgressStatus,
        })
      );
      const movedTask = state.tasks.find((t) => t.id === 1);
      expect(movedTask?.columnAlias).toBe('in-progress');
      expect(movedTask?.status.id).toBe('in-progress');
    });
  });

  describe('setSearchQuery', () => {
    it('sets the search query', () => {
      const state = tasksReducer(emptyState, setSearchQuery('hello'));
      expect(state.searchQuery).toBe('hello');
    });

    it('clears the query with empty string', () => {
      const stateWithQuery = { ...emptyState, searchQuery: 'old' };
      const state = tasksReducer(stateWithQuery, setSearchQuery(''));
      expect(state.searchQuery).toBe('');
    });
  });

  describe('setStatusFilter', () => {
    it('sets filter ids', () => {
      const state = tasksReducer(emptyState, setStatusFilter(['new', 'in-progress']));
      expect(state.statusFilterIds).toEqual(['new', 'in-progress']);
    });

    it('resets filter to null', () => {
      const stateWithFilter = { ...emptyState, statusFilterIds: ['new'] };
      const state = tasksReducer(stateWithFilter, setStatusFilter(null));
      expect(state.statusFilterIds).toBeNull();
    });
  });

  describe('toggleShowCompleted', () => {
    it('toggles from false to true', () => {
      const state = tasksReducer(emptyState, toggleShowCompleted());
      expect(state.showCompleted).toBe(true);
    });

    it('toggles from true to false', () => {
      const stateOn = { ...emptyState, showCompleted: true };
      const state = tasksReducer(stateOn, toggleShowCompleted());
      expect(state.showCompleted).toBe(false);
    });
  });

  describe('toggleTaskSelection', () => {
    it('adds task id to selection', () => {
      const state = tasksReducer(emptyState, toggleTaskSelection('5'));
      expect(state.selectedTaskIds).toContain('5');
    });

    it('removes task id when already selected', () => {
      const stateWithSelected = { ...emptyState, selectedTaskIds: ['5'] };
      const state = tasksReducer(stateWithSelected, toggleTaskSelection('5'));
      expect(state.selectedTaskIds).not.toContain('5');
    });
  });

  describe('clearTaskSelection', () => {
    it('clears all selected ids', () => {
      const stateWithSelected = { ...emptyState, selectedTaskIds: ['1', '2', '3'] };
      const state = tasksReducer(stateWithSelected, clearTaskSelection());
      expect(state.selectedTaskIds).toEqual([]);
    });
  });
});
