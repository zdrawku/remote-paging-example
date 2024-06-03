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
export class MasterViewComponent implements AfterViewInit {
  @ViewChild('grid1', { static: true }) public grid1: IgxGridComponent;
  @ViewChild('customPager', { read: TemplateRef, static: true }) public remotePager: TemplateRef<any>;
  public totalRecords: Observable<number>;
  public page = 0;
  public data: Observable<any[]>;
  public mode = GridPagingMode.Remote;
  public isLoading = true;

  constructor(private northwindService: NorthwindService) { }

  public ngAfterViewInit() {
    this.grid1.isLoading = true;

    this.data = this.northwindService.remoteData.asObservable();
    this.totalRecords = this.northwindService.dataLenght.asObservable();

    this.northwindService.getData(this.page, this.grid1.perPage);

    this.data.subscribe(() => {
      this.isLoading = false;
    });
  }

  public paginate(page) {
    this.isLoading = true;
    this.northwindService.getData(page, this.grid1.perPage);
  }
}
