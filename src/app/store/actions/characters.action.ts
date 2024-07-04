import { createAction, props } from '@ngrx/store';

export const addAlldata = createAction(
    '[Add All data] Add All Data',
    props<{ alldata: any[] }>()
);

export const addUnqOptions = createAction(
    '[Add All addUnqOptions] Add All addUnqOptions',
    props<{ allUnqOptions: any }>()
);


export const addFilterData = createAction(
    '[Add addFilterData] Add  addFilterData',
    props<{ filterData: any }>()
);