import { Component, TemplateRef, ViewChild } from '@angular/core';
import { IoclEmpServiceService } from '../../../services/iocl-emp-service.service';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TrnParcelIn } from '../../../model/trnParcelIn';
import { TrnParcelOut } from '../../../model/trnParcelOut';

import { Router } from '@angular/router';


@Component({
  selector: 'app-emp-history',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    NgFor,
    MatToolbarModule,
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule, NgIf,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatPaginatorModule
  ],
  templateUrl: './emp-history.component.html',
  styleUrl: './emp-history.component.css'
})
export class EmpHistoryComponent {
  @ViewChild('parcelInDialogTemplate') parcelInDialogTemplate!: TemplateRef<any>;
  @ViewChild('parcelOutDialogTemplate') parcelOutDialogTemplate!: TemplateRef<any>;
  // @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;
  @ViewChild('paginatorIn', { static: false }) paginatorIn!: MatPaginator;
  @ViewChild('paginatorOut', { static: false }) paginatorOut!: MatPaginator;
  
  displayedColumns: string[] = ['senderName', 'recipientName', 'date', 'view'];
  filterIn = '';
  filterOut = '';
  filteredParcelIn = new MatTableDataSource<TrnParcelIn>([]);
  filteredParcelOut = new MatTableDataSource<TrnParcelOut>([]);
  allParcelIn: TrnParcelIn[] = []; // Store the original data for filtering
  allParcelOut: TrnParcelOut[] = []; // Store the original data for filtering
  selectedParcel: any;
  public dialogRef!: MatDialogRef<any>; 
  empProfile: any;

  constructor(
    private ioclService:IoclEmpServiceService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit(): void {
   // this.empProfile = this.ioclService.getEmpData();
    this.loadParcelInData();
    this.loadParcelOutData();
  }

  loadParcelInData(page: number = 0, size: number = 8) {
    this.ioclService.getMyIncomingParcels(page, size).subscribe(data => {
      this.filteredParcelIn.data = data.content;
      this.paginatorIn.length = data.totalElements;
      this.applyInFilter();
    });
  }

  loadParcelOutData(page: number = 0, size: number = 8) {
    this.ioclService.getMyOutgoingParcels(page, size).subscribe(data => {
      this.filteredParcelOut.data = data.content;
      this.paginatorOut.length = data.totalElements;
      this.applyOutFilter();
    });
  }

   // Update your pagination handling methods
   onPageChangeIn(event: PageEvent) {
    this.loadParcelInData(event.pageIndex, event.pageSize);
  }

  onPageChangeOut(event: PageEvent) {
    this.loadParcelOutData(event.pageIndex, event.pageSize);
  }

  applyInFilter() {
    this.filteredParcelIn.filter = this.filterIn.trim().toLowerCase();
  }

  applyOutFilter() {
    this.filteredParcelOut.filter = this.filterOut.trim().toLowerCase();
  }

  clearFilter(type: string) {
    if (type === 'in') {
      this.filterIn = '';
      this.applyInFilter(); // Reapply the filter to show all data
    } else if (type === 'out') {
      this.filterOut = '';
      this.applyOutFilter(); // Reapply the filter to show all data
    }
  }

  openViewDialog(parcel: any) {
    const isParcelIn = parcel.inTrackingId !== undefined;
    const isParcelOut = parcel.outTrackingId !== undefined;

    if (isParcelIn) {
      this.selectedParcel = parcel;
      this.dialog.open(this.parcelInDialogTemplate, {
        data: parcel,
      });
    } else if (isParcelOut) {
      this.selectedParcel = parcel;
      this.dialog.open(this.parcelOutDialogTemplate, {
        data: parcel,
      });
    } else {
      console.error('Unknown parcel type');
    }
  }

  onClose(): void {
    this.dialog.closeAll();  // Close the dialog
  }


}

