import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProductsResult } from '../models/northwind/product-type';


const API_ENDPOINT = 'https://data-northwind.indigo.design';
@Injectable({
  providedIn: 'root'
})
export class NorthwindService {
  public remoteData: BehaviorSubject<any[]>;
  public dataLenght: BehaviorSubject<number> = new BehaviorSubject(0);
  public remoteCardsData: BehaviorSubject<any[]>;
  public dataCardsLenght: BehaviorSubject<number> = new BehaviorSubject(0);
  public url = `${API_ENDPOINT}/Products/GetPagedProducts`;

  constructor(private http: HttpClient) {
    this.remoteData = new BehaviorSubject([]);
    this.remoteCardsData = new BehaviorSubject([]);
  }

  public getData(index?: number, perPage?: number): any {
    let qS = '';

    if (perPage) {
      qS = `?skip=${index}&top=${perPage}`;
    }
    
    this.http
      .get<ProductsResult>(`${this.url + qS}`).pipe(
        map((data: ProductsResult) => data)
      ).subscribe((data) => {
        this.remoteData.next(data.items);
        this.dataLenght.next(data.totalRecordsCount);
      });
  }

  public getCardsData(index?: number, perPage?: number): any {
    let qS = '';

    if (perPage) {
      qS = `?skip=${index}&top=${perPage}`;
    }
    
    this.http
      .get<ProductsResult>(`${this.url + qS}`).pipe(
        map((data: ProductsResult) => data)
      ).subscribe((data) => {
        this.remoteCardsData.next(data.items);
        this.dataCardsLenght.next(data.totalRecordsCount);
      });
  }
}