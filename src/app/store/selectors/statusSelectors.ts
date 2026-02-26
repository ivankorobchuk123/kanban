import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { StatusOption } from '../statusOptions';

export const selectStatusOptions = (state: RootState): StatusOption[] =>
  state.statusOptions.statusOptions;

const selectStatusOptionsArray = (state: RootState) =>
  state.statusOptions.statusOptions;

export const selectStatusObjects = createSelector(
  [selectStatusOptionsArray],
  (statusOptions) =>
    statusOptions.reduce(
      (acc, s) => {
        acc[s.id] = s;
        return acc;
      },
      {} as Record<string, StatusOption>
    )
);

export const selectStatusOptionGroups = createSelector(
  [selectStatusOptionsArray],
  (all) => [{ label: '', options: all }]
);
