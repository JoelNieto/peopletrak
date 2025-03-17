import { signalStore, withHooks } from '@ngrx/signals';
import { Position } from '../models';
import { withCustomEntities } from './entities.feature';

export const PositionsStore = signalStore(
  withCustomEntities<Position>({ name: 'positions' }),
  withHooks({ onInit: ({ fetchItems }) => fetchItems() })
);
