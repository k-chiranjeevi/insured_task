import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ServiceService } from 'src/app/services/service.service';
import { addAlldata, addFilterData, addUnqOptions } from 'src/app/store/actions/characters.action';
import { AppState } from 'src/app/store/selectors/characters.selector';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public loading: boolean = false;
  public charactersData!: any[];
  public allData!: any[];

  displayedColumns: string[] = ['slNo', 'characterName', 'species', 'birth_year'];
  dataSource: any = new MatTableDataSource<any>(this.charactersData);
  uniqueOptions: any = {};
  public storeSub!: Subscription
  constructor(public service: ServiceService, public store: Store<any>) { }


  ngOnInit() {
    this.storeSub = this.store.subscribe(data => {
      this.allData = data.allCharactersData.filteredata;
      this.prepareCharsList();
    })
    this.loadingcharcaters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadingcharcaters() {
    this.loading = true;
    this.service.getCharacters().subscribe((data: any) => {
      if (data?.results?.length > 0) {
        data.results = data.results.map((item: any, index: number) => {
          return {
            ...item,
            id: index + 1
          }
        })
        this.charactersData = data.results;
        this.service.addDataByKey(data.results).subscribe((allData: any) => {
          this.loading = false;
          this.store.dispatch(addAlldata({ alldata: allData }));
          this.store.dispatch(addFilterData({ filterData: allData }));
          this.getOptionsnames(this.allData);
          this.prepareCharsList();
        })
      }
    }, (err) => {
      console.log(err)
      this.loading = false;
    })
  }

  prepareCharsList() {
    this.dataSource.data = this.allData.map((person: any, index: number) => {
      const specie = person?.specicesData?.map((specie: any) => specie.name ? specie.name : '')?.join(',');
      return {
        slNo: index + 1,
        characterName: person.name,
        species: specie,
        birth_year: person.birth_year
      }
    });
  }


  getOptionsnames(data: any) {
    this.uniqueOptions['filmsData'] = this.getUniqueNames(data, 'filmsData');
    this.uniqueOptions['speciesData'] = this.getUniqueNames(data, 'specicesData');
    this.uniqueOptions['starshipsData'] = this.getUniqueNames(data, 'starshipsData');
    this.uniqueOptions['vehiclesData'] = this.getUniqueNames(data, 'vehiclesData');
    this.store.dispatch(addUnqOptions({ allUnqOptions: this.uniqueOptions }))
  }



  getUniqueNames(data: any, key: string) {
    const uniqueTitles = new Set();

    data.forEach((character: any) => {
      if (character[key]?.length > 0) {
        character[key].forEach((option: any) => {
          if (key == 'filmsData') {
            uniqueTitles.add(option.title);
          } else if (key == 'specicesData' || key === 'starshipsData' || key == 'vehiclesData') {
            uniqueTitles.add(option.name);
          }
        });
      }
    });
    return Array.from(uniqueTitles);
  }


  ngOnDestroy() {
    this.storeSub.unsubscribe();
  }

}
