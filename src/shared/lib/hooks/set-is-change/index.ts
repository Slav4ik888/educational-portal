import { UseBase } from '../types';

/** setChanges true */
export function setChanges(G: UseBase) {
  G && ! G.isChanges && G.setIsChanges(true);
}
