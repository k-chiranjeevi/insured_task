import { createSelector } from '@ngrx/store';
import { CharactersData } from '../reducers/characters.reducer';


export interface AppState {
  charactersData: CharactersData;
}

export const charactersFeature = (state: AppState) => state.charactersData;

export const selectAllcharsData = createSelector(
    charactersFeature,
  (state: CharactersData) => state?.alldata ? state.alldata  :[]);