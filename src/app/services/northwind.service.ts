import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NorthwindService {
  public remoteData: BehaviorSubject<any[]>;
  public dataLenght: BehaviorSubject<number> = new BehaviorSubject(0);
  public url = 'https://data-northwind.indigo.design/Products/GetPagedProducts';

  constructor(private http: HttpClient) {
    this.remoteData = new BehaviorSubject([]);
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
}

interface ProductsResult {
  items: any[];
  totalRecordsCount: number;
}