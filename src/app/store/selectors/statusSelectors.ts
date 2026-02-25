import type { RootState } from '../index';
import type { StatusOption } from '../statusOptions';

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
