import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridPagingMode, IGX_GRID_DIRECTIVES, IgxGridComponent } from '@infragistics/igniteui-angular';
import { Observable, takeUntil } from 'rxjs';
import { NorthwindService } from '../services/northwind.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-master-view',
  standalone: true,
  imports: [IGX_GRID_DIRECTIVES, CommonModule],
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.scss']
})
export class MasterViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;
  @ViewChild('customPager', { read: TemplateRef, static: true }) public remotePager: TemplateRef<any>;
  public totalCount = 0;
  public page = 0;
  public data: Observable<any[]>;
  public mode = GridPagingMode.Remote;
  public isLoading = true;

  private _dataLengthSubscriber;
  private _perPage = 10;

  public get perPage(): number {
    return this._perPage;
  }

  public set perPage(val: number) {
    this._perPage = val;
    this.paginate(0);
  }

  constructor(private northwindService: NorthwindService) { }

  public ngOnInit() {
    this.data = this.northwindService.remoteData.asObservable();
    this.data.subscribe(() => {
      this.isLoading = false;
    });
    this._dataLengthSubscriber = this.northwindService.getDataLength().subscribe((data) => {
      this.totalCount = data;
    });
  }

  public ngOnDestroy() {
    if (this._dataLengthSubscriber) {
      this._dataLengthSubscriber.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    this.grid1.isLoading = true;
    this.northwindService.getData(0, this.grid1.perPage);
    this.northwindService.getDataLength();
  }

  public pagingDone(page) {
    const skip = page.current * this.grid1.perPage;
    this.northwindService.getData(skip, this.grid1.perPage);
  }

  public paginate(page) {
    this.isLoading = true;
    const skip = page * this.grid1.perPage;
    this.northwindService.getData(skip, this.grid1.perPage);
  }
}
