import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addAlldata, addFilterData } from 'src/app/store/actions/characters.action';
import { AppState } from 'src/app/store/selectors/characters.selector';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  filtersForm!: FormGroup
  constructor(public fb: FormBuilder, public store: Store<any>) { }
  moviesOptns: string[] = [];
  vehiclesOptns: string[] = [];
  speciesOptns: string[] = [];
  startshipsOptns: string[] = [];
  filterData: any;
  allData: any;
  birth_year_opts = [
    '20BBY-10ABY',
    '40BBY-20ABY',
    '60BBY-30ABY',
    '80BBY-40ABY',
    '100BBY-50ABY',
  ];

  ngOnInit() {
    this.filtersForm = this.fb.group({
      filmsData: [''],
      specicesData: [''],
      vehiclesData: [''],
      starshipsData: [''],
      birth_year: ['']
    });

    this.store.subscribe(data => {
      this.moviesOptns = data.allCharactersData?.unqOptions.filmsData;
      this.vehiclesOptns = data.allCharactersData?.unqOptions.vehiclesData;
      this.startshipsOptns = data.allCharactersData?.unqOptions.starshipsData;
      this.speciesOptns = data.allCharactersData?.unqOptions.speciesData;
      this.filterData = data.allCharactersData?.alldata;
      this.allData = data.allCharactersData?.alldata;
    })

  }

  filter() {
    const filters = this.filtersForm.value
    for (let key in filters) {
      if (!filters[key]) {
        delete filters[key]
      }
    }

    this.filterCharacters(filters);
    this.store.dispatch(addFilterData({ filterData: this.filterData }));
  }


  filterCharacters(filters: any) {
    this.filterData = this.filterData || this.allData;

    for (let key in filters) {
      if (filters[key] && key !== 'birth_year') {
        this.filterDataByKey(key, filters);
      } else if (filters[key] && key === 'birth_year') {
        this.applyBirthYearFilter(filters[key])
      }
    }
  }


  filterDataByKey(key: string, filters: any) {
    this.filterData = this.filterData.filter((character: any) => {
      if (key === 'filmsData') {
        return character[key].some((film: any) => film.title === filters[key])
      } else {
        return character[key].some((option: any) => option.name === filters[key])
      }
    });
  }

  applyBirthYearFilter(birthYearRange: string) {
    const [startYear, endYear] = birthYearRange.split('-');
    const minYear = this.convertToStandardYear(startYear.trim());
    const maxYear = this.convertToStandardYear(endYear.trim());

    this.filterData = this.filterData.filter((character: any) => {
      const birthYear = this.convertToStandardYear(character.birth_year);
      return birthYear !== null && birthYear >= Number(minYear) && birthYear <= Number(maxYear);
    });
  }

  convertToStandardYear(birthYear: string): number | null {
    if (!birthYear) return null;

    const isBBY = birthYear.endsWith('BBY');
    const isABY = birthYear.endsWith('ABY');
    const numericPart = parseInt(birthYear.slice(0, -3), 10);
    if (isBBY) {
      return -numericPart;
    } else if (isABY) {
      return numericPart;
    } else {
      return null; 
    }
  }

}
