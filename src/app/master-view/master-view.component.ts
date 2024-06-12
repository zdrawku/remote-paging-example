import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { GridPagingMode, IGX_GRID_DIRECTIVES, IgxGridComponent } from '@infragistics/igniteui-angular';
import { Observable } from 'rxjs';
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
  public data: Observable<any[]>;
  public mode = GridPagingMode.Remote;
  public isLoading = true;

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

  // Later can be extended to support OrderBy query option or even sorting and filtering
  private calculatePagination() {
    const skip = this.grid1.page * this.grid1.perPage;
    const top = this.grid1.perPage;
    return { skip, top };
  }
}
