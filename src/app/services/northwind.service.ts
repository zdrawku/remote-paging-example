import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductsResult } from '../models/northwind/product-type';
import { catchError, map } from 'rxjs/operators';

const API_ENDPOINT = 'https://data-northwind.indigo.design';

@Injectable({
  providedIn: 'root'
})
export class NorthwindService {
  private remoteData = new BehaviorSubject<any[]>([]);
  private dataLength = new BehaviorSubject<number>(0);
  private remoteCardsData = new BehaviorSubject<any[]>([]);
  private dataCardsLength = new BehaviorSubject<number>(0);
  private url = `${API_ENDPOINT}/Products/GetPagedProducts`;

  constructor(private http: HttpClient) {}

  public getData(index?: number, perPage?: number): void {
    this.fetchData(index, perPage).subscribe(
      data => {
        this.remoteData.next(data.items);
        this.dataLength.next(data.totalRecordsCount);
      },
      error => {
        console.error('Error fetching data', error);
      }
    );
  }

  public getCardsData(index?: number, perPage?: number): void {
    this.fetchData(index, perPage).subscribe(
      data => {
        this.remoteCardsData.next(data.items);
        this.dataCardsLength.next(data.totalRecordsCount);
      },
      error => {
        console.error('Error fetching cards data', error);
      }
    );
  }

  private fetchData(index?: number, perPage?: number): Observable<ProductsResult> {
    const params: any = {};
    if (index !== undefined) {
      params['skip'] = index;
    }
    if (perPage !== undefined) {
      params['top'] = perPage;
    }

    return this.http.get<ProductsResult>(this.url, { params }).pipe(
      map(data => data),
      catchError(error => {
        console.error('Error in fetchData', error);
        throw error;
      })
    );
  }

  public get remoteData$(): Observable<any[]> {
    return this.remoteData.asObservable();
  }

  public get dataLength$(): Observable<number> {
    return this.dataLength.asObservable();
  }

  public get remoteCardsData$(): Observable<any[]> {
    return this.remoteCardsData.asObservable();
  }

  public get dataCardsLength$(): Observable<number> {
    return this.dataCardsLength.asObservable();
  }
}
