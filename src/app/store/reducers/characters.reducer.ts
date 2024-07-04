import { State, createReducer, on } from "@ngrx/store";
import { addAlldata, addFilterData, addUnqOptions } from "../actions/characters.action";


export interface CharactersData {
    alldata: any[],
    unqOptions: UniqueOptions,
    filteredata:any[]
}

interface UniqueOptions {
    filmsData:string[],
    speciesData: string[],
    starshipsData:string[],
    vehiclesData: string[],
}
export const initialState: CharactersData = {
    alldata: [],
    filteredata:[],
    unqOptions: {
        filmsData: [],
        speciesData: [],
        starshipsData: [],
        vehiclesData: []
    }
};

export const charactersReducer = createReducer(
    initialState,
    on(addAlldata, (state, { alldata }) => {
        return {
            ...state,
            alldata: alldata
        }
    }),
    on(addUnqOptions, (state, { allUnqOptions }) => {
        return {
            ...state,
            unqOptions: allUnqOptions
        }
    }),
    on(addFilterData, (state, { filterData }) => {
        return {
            ...state,
            filteredata: filterData
        }
    })
);