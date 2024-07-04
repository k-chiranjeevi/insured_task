import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, mergeMap, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://swapi.dev/api';
  private urlCache: { [url: string]: any } = {};

  getCharacters(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/people`).pipe(
      catchError(error => {
        console.error('Error fetching species data:', error);
        return throwError(error);
      })
    )
  }

  getCharacter(id: any) {
    return this.http.get<any>(`${this.apiUrl}/people/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching species data:', error);
        return throwError(error);
      })
    )
  }


  addDataByKey(characters: any): Observable<any> {
    const uniqueUrls = new Set<string>();

    characters.forEach((character: any) => {
      character.species?.forEach((url: any) => uniqueUrls.add(url));
      character.films?.forEach((url: any) => uniqueUrls.add(url));
      character.vehicles?.forEach((url: any) => uniqueUrls.add(url));
      character.starships?.forEach((url: any) => uniqueUrls.add(url));
      if (character.homeworld) {
        uniqueUrls.add(character.homeworld);
      }
    });

    const uniqueUrlsArray = Array.from(uniqueUrls);
    const fetchDataRequests = this.fetchData(uniqueUrlsArray);

    return fetchDataRequests.pipe(
      map((data) => {
        data.forEach(item => {
          this.urlCache[item.url] = item;
        });
        return characters.map((character: any) => {
          const specicesData = character.species?.map((url: any) => this.urlCache[url]);
          const filmsData = character.films?.map((url: any) => this.urlCache[url]);
          const vehiclesData = character.vehicles?.map((url: any) => this.urlCache[url]);
          const starshipsData = character.starships?.map((url: any) => this.urlCache[url]);
          const planetData = character.homeworld ? this.urlCache[character.homeworld] : null;

          return {
            ...character,
            specicesData,
            filmsData,
            vehiclesData,
            starshipsData,
            planetData: [planetData]
          };
        });
      })
    );
  }

  private fetchData(urls: string[]): Observable<any[]> {
    if (urls.length === 0) {
      return of([]);
    }

    const requests = urls.map(url => {
      if (this.urlCache[url]) {
        return of(this.urlCache[url]);
      } else {
        return this.http.get(url).pipe(
          tap(data => {
            this.urlCache[url] = data;
          }),
          catchError(error => {
            console.error('Error fetching data:', error);
            return of(null);
          })
        );
      }
    });
    return forkJoin(requests);
  }

}



