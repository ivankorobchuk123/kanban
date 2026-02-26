import type { RootState } from '../index';
import type { StatusOption } from '../statusOptions';
import { ADDITIONAL_STATUS_OBJECTS } from '../statusOptions';

const ARCHIVE_STATUS_IDS = new Set(['completed', 'canceled']);

export const selectStatusOptions = (state: RootState): StatusOption[] =>
  state.statusOptions.statusOptions;

export const selectStatusObjects = (state: RootState): Record<string, StatusOption> =>
  state.statusOptions.statusOptions.reduce(
    (acc, s) => {
      acc[s.id] = s;
      return acc;
    },
    {} as Record<string, StatusOption>
  );

export const selectStatusOptionGroups = (
  state: RootState
): Array<{ label: string; options: StatusOption[] }> => {
  const all = state.statusOptions.statusOptions;
  const inProgress = all.filter((s) => !ARCHIVE_STATUS_IDS.has(s.id));
  const complete = [
    ADDITIONAL_STATUS_OBJECTS['completed'],
    ADDITIONAL_STATUS_OBJECTS['canceled'],
  ];

  return [
    { label: 'In Progress', options: inProgress },
    { label: 'Complete', options: complete },
  ];
};
