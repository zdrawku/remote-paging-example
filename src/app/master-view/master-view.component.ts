import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import {
  GridPagingMode, IGX_GRID_DIRECTIVES, IgxGridComponent, IgxPaginatorComponent, IgxCardComponent,
  IgxRippleDirective, IgxButtonDirective, IgxIconModule, IgxInputGroupComponent, IgxCheckboxComponent,
  IgxCardActionsComponent, IgxCardMediaDirective, IgxCardHeaderComponent, IgxCardContentDirective
} from '@infragistics/igniteui-angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NorthwindService } from '../services/northwind.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master-view',
  standalone: true,
  imports: [IGX_GRID_DIRECTIVES, CommonModule, IgxIconModule, IgxInputGroupComponent, IgxCardComponent,
    IgxCardActionsComponent, IgxCardMediaDirective, IgxCardHeaderComponent, IgxCardContentDirective,
    IgxPaginatorComponent, IgxRippleDirective, IgxButtonDirective, IgxCheckboxComponent],
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;
  @ViewChild('customPager', { read: TemplateRef, static: true }) public remotePager: TemplateRef<any>;
  @ViewChild('paginator', { static: true }) public paginator!: IgxPaginatorComponent;
  public data$: Observable<any[]>;
  public totalRecords$: Observable<number>;
  public cardsData$: Observable<any[]>;
  public totalCardsRecords$: Observable<number>;
  public mode = GridPagingMode.Remote;
  public isLoading = true;
  private _perPage = 15;

  // Variables/AB properties needed for Cards pagination
  private _cardsPerPage = 5;
  public cardItemsPerPage = [5, 10, 15, 25, 50, 100, 500];

  // For Grid
  public get perPage(): number {
    return this._perPage;
  }

  public set perPage(val: number) {
    this._perPage = val;
    this.paginateGrid();
  }

  // For Cards
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
    this.data$ = this.northwindService.remoteData$;
    this.totalRecords$ = this.northwindService.dataLength$;

    // Load Grid data
    this.paginateGrid();

    this.data$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isLoading = false;
    });

    // Initialize Card data
    this.cardsData$ = this.northwindService.remoteCardsData$;
    this.totalCardsRecords$ = this.northwindService.dataCardsLength$;

    // Load Card data
    this.paginateCards();
  }

  public paginateGrid() {
    this.isLoading = true;
    const { skip, top } = this.calculatePagination(this.grid1.page, this._perPage);
    this.northwindService.getData(skip, top);
  }

  public paginateCards() {
    const { skip, top } = this.calculatePagination(this.paginator.page, this._cardsPerPage);
    this.northwindService.getCardsData(skip, top);
  }

  private calculatePagination(page: number, perPage: number) {
    const skip = page * perPage;
    const top = perPage;
    return { skip, top };
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
