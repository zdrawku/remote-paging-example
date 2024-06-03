import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NorthwindService {
  public remoteData: BehaviorSubject<any[]>;
  public dataLenght: BehaviorSubject<number> = new BehaviorSubject(0);
  public url = 'https://localhost:7244/Products/GetAllPagedProducts';

  constructor(private http: HttpClient) {
    this.remoteData = new BehaviorSubject([]);
  }

  public getData(index?: number, perPage?: number): any {
    let qS = '';

    if (perPage) {
      qS = `?pageNumber=${index}&pageSize=${perPage}`;
    }

    this.http
      .get(`${this.url + qS}`).pipe(
        map((data: any) => data)
      ).subscribe((data) => {
        this.dataLenght.next(data.totalRecordsCount);
        this.remoteData.next(data.products);
      });
  }
}
