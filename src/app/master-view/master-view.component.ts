import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { GridPagingMode, IGX_GRID_DIRECTIVES, IgxGridComponent, IgxPaginatorComponent, IgxCardComponent,
  IgxRippleDirective, IgxButtonDirective, IgxIconModule, IgxInputGroupComponent,
  IgxCardActionsComponent,
  IgxCardMediaDirective,
  IgxCardHeaderComponent,
  IgxCardContentDirective
 } from '@infragistics/igniteui-angular';
import { Observable } from 'rxjs';
import { NorthwindService } from '../services/northwind.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master-view',
  standalone: true,
  imports: [IGX_GRID_DIRECTIVES, CommonModule, IgxIconModule, IgxInputGroupComponent, IgxCardComponent, IgxCardActionsComponent, 
    IgxCardMediaDirective, IgxCardHeaderComponent, IgxCardContentDirective, IgxPaginatorComponent, IgxRippleDirective, IgxButtonDirective],
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements AfterViewInit {
  @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;
  @ViewChild('customPager', { read: TemplateRef, static: true }) public remotePager: TemplateRef<any>;
  @ViewChild('paginator', { static: true }) public paginator!: IgxPaginatorComponent;
  public totalRecords: Observable<number>;
  public data: Observable<any[]>;
  public mode = GridPagingMode.Remote;
  public isLoading = true;  
  private _perPage = 15;
  private _cardsPerPage = 3;
  public cardItemsPerPage = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30];

  // For Grid
  public get perPage(): number {
    return this._perPage;
  }

  public set perPage(val: number) {
    this._perPage = val;
    this.paginate();
  }

  // For cards
  public get perPageCards(): number {
    return this._cardsPerPage;
  }

  public set perPageCards(val: number) {
    this._cardsPerPage = val;
    this.paginateCards();
  }

  constructor(private northwindService: NorthwindService) { }

  public ngAfterViewInit() {
    // Initialize Grid
    this.grid1.isLoading = true;
    this.data = this.northwindService.remoteData.asObservable();
    this.totalRecords = this.northwindService.dataLenght.asObservable();

    // Load Grid data
    const { skip, top } = this.calculatePagination();
    this.northwindService.getData(skip, top);

    this.data.subscribe(() => {
      this.isLoading = false;
    });
  }

  public paginate() {
    this.isLoading = true;
    const { skip, top } = this.calculatePagination();

    this.northwindService.getData(skip, top);
  }

  public paginateCards() {
    const { skip, top } = this.calculateCardsPagination();

    this.northwindService.getData(skip, top);
  }
  
  // Later can be extended to support OrderBy query option or even sorting and filtering
  private calculatePagination() {
    const skip = this.grid1.page * this._perPage;
    const top = this._perPage;
    return { skip, top };
  }

  private calculateCardsPagination() {
    const skip = this.paginator.page * this._cardsPerPage;
    const top = this._cardsPerPage;
    return { skip, top };
  }
}
